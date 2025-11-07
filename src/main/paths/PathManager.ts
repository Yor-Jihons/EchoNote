import { app } from 'electron';
import path from 'path';
import fs from 'fs';

export default class PathManager{
    #dbFileName: string;
    #dbFilePath: string;
    #mainDirPath: string;
    #isPortableMode: boolean;

    public constructor(){
        this.#dbFileName = "";
        this.#dbFilePath = "";
        this.#mainDirPath = "";
        this.#isPortableMode = false;
    }

    public init( dbFileName: string, mainDirPath: string ){
        this.#dbFileName = dbFileName;
        this.#mainDirPath = mainDirPath;
        const { dirPath, isPortableMode } = PathManager.createDatabaseDirPath( this.#mainDirPath );
        this.#isPortableMode = isPortableMode;
        this.#dbFilePath = path.join( dirPath, this.#dbFileName );
    }

    private static createDatabaseDirPath( mainDirPath: string ) : {dirPath: string, isPortableMode: boolean}{
        let baseDirPath = mainDirPath;
        const portableDatabaseDirPath1 = path.join( baseDirPath, "data" );
        console.log( "1: " + portableDatabaseDirPath1 );
        if( fs.existsSync( portableDatabaseDirPath1 ) ){
            return { dirPath: portableDatabaseDirPath1, isPortableMode: true };
        }

        for( let i = 0; i < 3; i++ ) baseDirPath = path.dirname( baseDirPath );
        const portableDatabaseDirPath2 = path.join( baseDirPath, "data" );
        console.log( "2: " + portableDatabaseDirPath2 );
        if( !fs.existsSync( portableDatabaseDirPath2 ) ){
            return { dirPath: app.getPath( "userData" ), isPortableMode: false };
        }
        return { dirPath: portableDatabaseDirPath2, isPortableMode: true };
    }

    get isPortableMode() : boolean{
        return this.#isPortableMode;
    }

    get dbFilePath() : string{
        return this.#dbFilePath;
    }
}
