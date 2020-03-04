require('dotenv').config();
const mysqldump = require('mysqldump');
const mail = require('./mail');

const date = new Date();
const file_name = `${date.getFullYear()}_${date.getMonth()}_${date.getDay()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
const backup_file = `./backups/${file_name}.sql.gz`;

(async () => {
    let is_running = false;
    setInterval(async () => {

        if (is_running) {
            console.log('[task]', new Date(), 'another task is already running');
            return;
        }
        console.log('[task]', new Date(), 'Task starts to run');
        is_running = true;

        // dump the result straight to a compressed file
        await mysqldump({
            connection: {
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
            },
            dumpToFile: backup_file,
            compressFile: true,
        });

        mail.send_mail(process.env.MAIL_FROM_NAME, process.env.MAIL_BACKUP, `Backup ${file_name}`, 'Download backup from attachment', file_name, backup_file);

        console.log('[task]', new Date(), 'Backup file is:-', backup_file);

        is_running = false;
        console.log('[task]', new Date(), 'Task is finished');

    }, parseInt(process.env.RUNNING_EVERY || 1) * 1000 * 60 * 60)

})();