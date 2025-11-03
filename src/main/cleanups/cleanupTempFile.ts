/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs';

export default function cleanupTempFile( filepath: string ){
    try{
        if( fs.existsSync( filepath ) ) fs.unlinkSync( filepath );
    }catch( err: unknown ){
        //console.error( '一時ファイルのクリーンアップ中にエラーが発生しました:', err );
    }
}
