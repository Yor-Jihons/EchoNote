import BetterSqlite3 from 'better-sqlite3';
import ChatListItem from '../../types/ChatListItem.js';

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
        const dummyDataInsertion = `
            INSERT OR IGNORE INTO chats(id, ai_type, chat_name) VALUES(1, '', 'The sample chat 1');
            INSERT OR IGNORE INTO chats(id, ai_type, chat_name) VALUES(2, '', 'The sample chat 2');
            INSERT OR IGNORE INTO chats(id, ai_type, chat_name) VALUES(3, '', 'The sample chat 3');
            INSERT OR IGNORE INTO chats(id, ai_type, chat_name) VALUES(4, '', 'The sample chat 4');

            INSERT OR IGNORE INTO summaries(id, chat_id, summary_txt) VALUES(1, 1, 'summary 1');
            INSERT OR IGNORE INTO summaries(id, chat_id, summary_txt) VALUES(2, 2, 'summary 2');
            INSERT OR IGNORE INTO summaries(id, chat_id, summary_txt) VALUES(3, 3, 'summary 3');
            INSERT OR IGNORE INTO summaries(id, chat_id, summary_txt) VALUES(4, 4, 'summary 4');

            INSERT OR IGNORE INTO messages(id, chat_id, order_in_chat, sender_id, message_txt) VALUES(1, 1, 1, 1, 'text 1.1');
            INSERT OR IGNORE INTO messages(id, chat_id, order_in_chat, sender_id, message_txt) VALUES(2, 1, 2, 2, 'text 1.2');
            INSERT OR IGNORE INTO messages(id, chat_id, order_in_chat, sender_id, message_txt) VALUES(3, 2, 1, 1, 'text 2.1');
            INSERT OR IGNORE INTO messages(id, chat_id, order_in_chat, sender_id, message_txt) VALUES(4, 2, 2, 2, 'text 2.2');
            INSERT OR IGNORE INTO messages(id, chat_id, order_in_chat, sender_id, message_txt) VALUES(5, 3, 1, 1, 'text 3.1');
            INSERT OR IGNORE INTO messages(id, chat_id, order_in_chat, sender_id, message_txt) VALUES(6, 4, 1, 1, 'text 4.1');
        `;
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
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            INSERT OR IGNORE INTO senders VALUES(1, 'Me');
            INSERT OR IGNORE INTO senders VALUES(2, 'AI');
            ${dummyDataInsertion}
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

    public addChat( chatName: string, aiType: string ){
        const sql: string = `
            INSERT INTO chats(ai_type, chat_name) VALUES(?, ?)
                RETURNING id, ai_type, chat_name, created_at, updated_at
        `;
        const stmt = this.#db!.prepare( sql );
        try{
            const insertedRow = stmt.get( aiType, chatName ) as ChatListItem;
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
}
