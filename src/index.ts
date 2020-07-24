import Koa from 'koa'

const app = new Koa();

import Router from '@koa/router'

const router = new Router();

import bodyparser from 'koa-bodyparser'
app.use(bodyparser())

//Database
import low from 'lowdb'
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('res/db.json')
const db = low(adapter)


//Templates
import Pug from 'koa-pug'
new Pug({
    viewPath:'./res/views',
    basedir: './res/views',
    app:app
});

router.get('/',async ctx=>{
    const contacts = db.get('contacts').value()
    await ctx.render('index',{contacts});
});

router.post('/:id/delete', async(ctx)=>{
    db.get('contacts').remove({id: +ctx.params.id}).write()
    await ctx.redirect('/')
});

interface IContacts{
    id:number,
    firstname:string,
    lastname:string,
    email:string,
    phone:string
}




router.post('/',async(ctx)=>{
    const contacts:IContacts[]=db.get("contacts").value()

    const maxId=contacts.reduce((prev,curr)=>{
        return Math.max(prev,curr.id);
    },0); 
    contacts.push({
        ...ctx.request.body,
        id: maxId + 1
      })
    
      // write to db
      db.setState({ contacts }).write()
      
      await ctx.redirect('/')
    });



app
    .use(router.routes())
    .use(router.allowedMethods())
const PORT = 3000
app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`)
});