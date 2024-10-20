import { readFileSync , writeFileSync} from 'fs';

class JsonFileReader {
    read(filePath: string): any {
        const fileData = readFileSync(filePath, 'utf-8');
        return JSON.parse(fileData)
    }
    write(filePath: string, data: any): void {
        writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
}

export default new JsonFileReader();