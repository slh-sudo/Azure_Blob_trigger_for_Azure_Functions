const { app } = require('@azure/functions');
const sql = require('mssql');

app.storageBlob('storageBlobTrigger2', {
    path: 'samples-workitems/{name}',
    connection: '', // ここに接続文字列を入力してください
    handler: async (blob, context) => {
        context.log(`Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`);

        // Blobをテキストとして読み込む
        const blobText = blob.toString();
        context.log(`Blob content: ${blobText}`);

         // Azure SQL Databaseの接続情報
        const config = {
        user: 'dbadmin',
        password: 'P@ssword1234',
        server: 'blob-func-test.database.windows.net',
        database: 'blobfunctest',
        options: {
            encrypt: true
            }
        };

        try {
            // データベースに接続
            let pool = await sql.connect(config);
            const lines = blobText.split('\n')

            for(let line of lines){
                const [name, email, password] = line.split(' ');
                // データをusersテーブルにインサート
                await pool.request()
                // データをusersテーブルにインサート
                await pool.request()
                .input('name', sql.NVarChar, name)
                .input('email', sql.NVarChar, email)
                .input('password', sql.NVarChar, password)
                .query('INSERT INTO users (name, email, password) VALUES (@name, @email, @password)');
            }

            context.log('Data inserted successfully.');
        } catch (err) {
            context.log('Error occurred while connecting to the database or inserting data: ', err);
        }

        context.log('function triggered!!!')
    }
});
