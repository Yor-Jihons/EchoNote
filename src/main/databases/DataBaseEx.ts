import BetterSqlite3 from 'better-sqlite3';
import ChatListItem from '../../types/ChatListItem.js';
import MessageListItem from '../../types/MessageListItem.js';
import ChatInfo from '../../types/ChatInfo.js';
import SummaryListItem from '../../types/SummaryListItem.js';

export default class DataBaseEx{
    #db: BetterSqlite3.Database|undefined;

    public close(){
        this.#db!.close();
    }

    public getDB() : BetterSqlite3.Database{
        return this.#db!;
    }

    public constructor(){
        this.#db = undefined;
    }

    public open( dbFilePath: string ) : boolean{
        this.#db = new BetterSqlite3( dbFilePath, { verbose: console.log } );
    return true;
    }

    public backup( backupDbFilePath: string, callBackFunc: (message: string) => void ){
        this.#db?.backup( backupDbFilePath ).then( () => {
            callBackFunc( "バックアップが完了しました。" );
        }).catch( ( err ) => {
            callBackFunc( "バックアップ中にエラーが発生しました:" + err.message );
        });
    }

    public createTables() : BetterSqlite3.Database{
        return this.#db!.exec( `
            CREATE TABLE IF NOT EXISTS senders (
                id INTEGER PRIMARY KEY,
                sender_name TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                chat_id INTEGER NOT NULL,
                order_in_chat INTEGER NOT NULL,
                sender_id INTEGER NOT NULL,
                message_txt TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS summaries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                chat_id INTEGER,
                summary_txt TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS chats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ai_type TEXT,
                chat_name TEXT,
                description TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TRIGGER IF NOT EXISTS update_messages_updated_at
                AFTER UPDATE ON messages
                FOR EACH ROW
                WHEN OLD.message_txt IS NOT NEW.message_txt
                BEGIN
                    UPDATE messages SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
                END;
            CREATE TRIGGER IF NOT EXISTS update_summaries_updated_at
                AFTER UPDATE ON summaries
                FOR EACH ROW
                WHEN OLD.summary_txt IS NOT NEW.summary_txt
                BEGIN
                    UPDATE summaries SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
                END;
            CREATE TRIGGER IF NOT EXISTS update_chats_updated_at
                AFTER UPDATE ON chats
                FOR EACH ROW
                WHEN OLD.ai_type IS NOT NEW.ai_type OR OLD.chat_name IS NOT NEW.chat_name
                BEGIN
                    UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
                END;

            INSERT OR IGNORE INTO senders VALUES(1, 'Me');
            INSERT OR IGNORE INTO senders VALUES(2, 'AI');
        `);
    }

    public fetchChats( query: string ){
        try{
            let sql = "";
            let params: string[] = [];
            if( query === "" ){
                sql = "SELECT id, chat_name FROM chats ORDER BY updated_at DESC";
            }else{
                sql = `
                SELECT DISTINCT id, chat_name
                    FROM chats
                    WHERE chat_name LIKE ?
                UNION
                SELECT c.id, c.chat_name
                    FROM chats AS c
                    JOIN messages AS m
                    ON c.id = m.chat_id
                    WHERE m.message_txt LIKE ?
                `;
                params = [ `%${query}%`, `%${query}%` ];
            }

            const stmt = this.#db!.prepare( sql );
            const result = stmt.all( ...params );
            return result;
        }catch( error: unknown ){
            console.error('Failed to fetch chats:', error);
            return [];
        }
    }

    public addChat( chatName: string, aiType: string, description: string ){
        const transaction = this.#db!.transaction( () => {
            const chatsSql: string = `
                INSERT INTO chats(ai_type, chat_name, description) VALUES(?, ?, ?)
                    RETURNING id, ai_type, chat_name, description, created_at, updated_at
            `;
            const chatsStmt = this.#db!.prepare( chatsSql );
            const v1 = chatsStmt.get( aiType, chatName, description ) as ChatListItem;
            const summarySql: string = `
                INSERT INTO summaries(chat_id, summary_txt) VALUES(?, ?)
                    RETURNING id, chat_id, summary_txt, created_at, updated_at
            `;
            const summaryStmt = this.#db!.prepare( summarySql );
            const v2 = summaryStmt.get( v1.id, "" ) as ChatListItem;
            return { chat: v1, summary: v2 };
        });
        try{
            const value = transaction();
            return { success: true, value: value };
        }catch( error: unknown ){
            return { success: false, value: null, errMessage: (error as Error).message };
        }
    }

    public addMessage( chatId: number, orderInChat: number, senderId: number, messageText: string ){
        const sql: string = `
            INSERT INTO messages(chat_id, order_in_chat, sender_id, message_txt) VALUES(?, ?, ?, ?)
                RETURNING id, chat_id, order_in_chat, sender_id, message_txt, created_at, updated_at
        `;
        const stmt = this.#db!.prepare( sql );
        try{
            const insertedRow = stmt.get( chatId, orderInChat, senderId, messageText ) as MessageListItem;
            return { success: true, value: insertedRow };
        }catch( error: unknown ){
            return { success: false, value: null, errMessage: (error as Error).message };
        }
    }

    public deleteChat( chatId: number ){
        const begin = this.#db!.prepare('BEGIN');
        const commit = this.#db!.prepare('COMMIT');
        const rollback = this.#db!.prepare('ROLLBACK');

        const deleteChatStmt = this.#db!.prepare('DELETE FROM chats WHERE id = ?');
        const deleteMessagesStmt = this.#db!.prepare('DELETE FROM messages WHERE chat_id = ?');
        const deleteSummaryStmt = this.#db!.prepare('DELETE FROM summaries WHERE chat_id = ?');
        try{
            begin.run();
            deleteMessagesStmt.run(chatId);
            deleteSummaryStmt.run(chatId);
            deleteChatStmt.run(chatId);
            commit.run();
        }catch( error: unknown ){
            rollback.run();
            throw error;
        }
    }

    public updateMessage( id: number, newText: string ){
        const sql: string = "UPDATE messages SET message_txt = ? WHERE id = ? RETURNING id, chat_id, order_in_chat, sender_id, message_txt, created_at, updated_at";
        const stmt = this.#db!.prepare( sql );
        try{
            const renewedRow = stmt.get( newText, id ) as MessageListItem;
            return { success: true, value: renewedRow };
        }catch( error: unknown ){
            return { success: false, value: null, errMessage: (error as Error).message };
        }
    }

    public updateSummary( id: number, newText: string ){
        const sql: string = "UPDATE summaries SET summary_txt = ? WHERE id = ? RETURNING id, chat_id, summary_txt, created_at, updated_at";
        const stmt = this.#db!.prepare( sql );
        try{
            const renewedRow = stmt.get( newText, id ) as SummaryListItem;
            return { success: true, value: renewedRow };
        }catch( error: unknown ){
            return { success: false, value: null, errMessage: (error as Error).message };
        }
    }

    public updateChatName( id: number, chatName: string ){
        const sql: string = "UPDATE chats SET chat_name = ? WHERE id = ? RETURNING id, ai_type, chat_name, created_at, updated_at";
        const stmt = this.#db!.prepare( sql );
        try{
            const renewedRow = stmt.get( chatName, id ) as ChatListItem;
            return { success: true, value: renewedRow };
        }catch( error: unknown ){
            return { success: false, value: null, errMessage: (error as Error).message };
        }
    }

    public updateAIName( id: number, aiType: string ){
        const sql: string = "UPDATE chats SET ai_type = ? WHERE id = ? RETURNING id, ai_type, chat_name, created_at, updated_at";
        const stmt = this.#db!.prepare( sql );
        try{
            const renewedRow = stmt.get( aiType, id ) as ChatListItem;
            return { success: true, value: renewedRow };
        }catch( error: unknown ){
            return { success: false, value: null, errMessage: (error as Error).message };
        }
    }

    public fetchChatInfo( chatId: number ){
        try{
            const sql4Chats: string = `
                SELECT id, chat_name, ai_type, created_at, updated_at
                    FROM chats
                    WHERE id = ?
            `;
            const selectChatsStmt = this.#db!.prepare( sql4Chats );
            const ret4Chats = selectChatsStmt.get( chatId ) as ChatListItem;

            const sql4Messages: string = `
                SELECT id, order_in_chat, chat_id, sender_id, message_txt, created_at, updated_at
                    FROM messages
                    WHERE chat_id = ?
            `;
            const selectMessagesStmt = this.#db!.prepare( sql4Messages );
            const ret4Messages = selectMessagesStmt.all( chatId ) as MessageListItem[];

            const sql4Summaries: string = `
                SELECT id, summary_txt, chat_id, created_at, updated_at
                    FROM summaries
                    WHERE chat_id = ?
            `;
            const selectSummariesStmt = this.#db!.prepare( sql4Summaries );
            const ret4Summaries = selectSummariesStmt.get( chatId ) as SummaryListItem;

            return { success: true, value: { id: chatId, chat: ret4Chats, messages: ret4Messages, summary: ret4Summaries } as ChatInfo };
        }catch( error: unknown ){
            return { success: false, value: null, errMessage: (error as Error).message };
        }
    }
}
