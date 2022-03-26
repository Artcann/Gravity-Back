import { Injectable } from '@nestjs/common';
import * as path from 'path';
let fs = require('fs');

@Injectable()
export class StaticService {

    private baseRoute: string;

    constructor() {
        this.baseRoute = path.resolve(process.env.IMAGE_ROUTE ?? "./ressources/images")
    }

    public async getImage(filename: string) {
        try {
        return fs.createReadStream(path.join(this.baseRoute, filename));
        } catch (e) {
        return null;
        }
    }

    public deleteImage(filename: string) {
        try {
            return fs.unlinkSync(path.join(this.baseRoute, filename));
        } catch(e) {
            return null;
        }
    }
}
