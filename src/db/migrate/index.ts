import config from "../../config";
import fs from "fs";
import path from "path";
import pool from "..";


const runMigrates  = async() => {
    
    const migrationsPath = path.join(__dirname, "../migrations")
    const files = fs.readdirSync(migrationsPath);

    console.log("current migration path: ", migrationsPath)

    for(const file of files){
        const sql = fs.readFileSync(path.join(migrationsPath, file), "utf-8");
        console.log(`Running migration: ${file}`);
        await pool.query(sql);
    }

    console.log("All migration executed");
    process.exit();

}


runMigrates().catch((err) => {
    console.error("Migration Error: ", err);
    process.exit(1);
})