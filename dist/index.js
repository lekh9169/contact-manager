"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const app = new koa_1.default();
const router_1 = __importDefault(require("@koa/router"));
const router = new router_1.default();
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
app.use(koa_bodyparser_1.default());
//Database
const lowdb_1 = __importDefault(require("lowdb"));
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('res/db.json');
const db = lowdb_1.default(adapter);
//Templates
const koa_pug_1 = __importDefault(require("koa-pug"));
new koa_pug_1.default({
    viewPath: './res/views',
    basedir: './res/views',
    app: app
});
router.get('/', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const contacts = db.get('contacts').value();
    yield ctx.render('index', { contacts });
}));
router.post('/:id/delete', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    db.get('contacts').remove({ id: +ctx.params.id }).write();
    yield ctx.redirect('/');
}));
router.post('/', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const contacts = db.get("contacts").value();
    const maxId = contacts.reduce((prev, curr) => {
        return Math.max(prev, curr.id);
    }, 0);
    contacts.push(Object.assign(Object.assign({}, ctx.request.body), { id: maxId + 1 }));
    // write to db
    db.setState({ contacts }).write();
    yield ctx.redirect('/');
}));
app
    .use(router.routes())
    .use(router.allowedMethods());
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
//# sourceMappingURL=index.js.map