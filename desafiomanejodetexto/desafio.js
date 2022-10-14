import fs from 'fs'

export default class Contenedor{
    file;
    title;
    price;
    thumbnail;
    id;

constructor(title,price,thumbnail,id){
    this.file= "./clase4/productos.txt";
    this.title = title;
    this.price = price;
    this.thumbnail = thumbnail;
    this.id = id;
}

async readProducts(){
    console.log("leyendo productos");
    try{
        return await new Promise((resolve,reject) => {
            fs.readFile(this.file,"utf-8",(error,data)=>{
                if(error){
                    reject("Error al leer el archivo")
                } else{
                    resolve(JSON.parse(data));
                }
            })
        })
    }catch(error){
        console.log(error)
    }
}
 async deleteProducts(products){
     console.log('borrando productos')
     try{
         return await new Promise((resolve,reject) => {
             fs.writeFile(
                 this.file,
                 JSON.stringify(products,null,2),
                 (error,data)=> {
                     if(error){
                         reject('error al borrar los productos')
                     }else{
                         resolve('borrado finalizado!')
                     }
                 }
             );
         });
     } catch(error){
         console.log(error)
     }
 };

 async getLastId(){
     const result = await this.readProducts()
     .then((response) => {
         return response;
     })
     .catch((error) =>{
         return error
     });
     const lasIndex = result.length;
     return result[lasIndex - 1].id;
 }

 async addProduct(products){
     console.log('agregando producto');
     try{
         const result = await this.readProducts()
         .then((response) => {
             return response
         })
         .catch((error) =>{
             return error
         });
         result.push(products);

         return await new Promise((resolve,reject) => {
             fs.writeFile(
                 this.file,
                 JSON.stringify(result,null,2),
                 (error) =>{
                     if(error){
                         reject('error al escribir el producto')
                     }else{
                         resolve('producto agregado')
                     }
                 }
             );
         });
     }catch(error){
         console.log(error);
     }
 };

 async save(product){
     const idLast = await this.getLastId();

     const producto = {
         title: product.title,
         price: product.price,
         thumbnail: product.thumbnail,
         id: idLast +1,
     };

     this.addProduct(producto)
     .then((response) => console.log(`producto agregado: ${response}`))
     .catch((error) => console.log(`error ${error}`))
 }

   async getById(id){
       const result = await this.readProducts()
       .then((response) => {
           return response;
       })
       .catch((error) => {
           return error
       });

       console.log('buscando productos...')
       const product = result.find((product) => product.id === id);

       if(product !== undefined){
           return console.log(product)
       }else{
           console.log(`no se encontro un producto para el id ${id}`)
           return null
       }
   }

    getAll(){
        this.readProducts()
        .then((response)=> 
        console.log(`productos: ${JSON.stringify(response,null,2)}`)
        )
        .catch((error) => console.log(`error: ${error}`))
    }

    async deleteById(id){
        const result = await this.readProducts()
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error;
        })

        console.log('eliminando producto...')
        const product = result.filter((item) => item.id !== id);

        if(product !== undefined){
            setTimeout(() => {
                this.deleteProducts(product)
                .then((response) => console.log(`productos: ${response}`))
                .catch((error) => console.log(`error : ${error}`))
            },500);
        }else{
            console.log(`no se encontro el producto a eliminar para el id ${id}`);
            return null;
        }
    }
    deleteAll(){
        setTimeout(() => {
            this.deleteProducts("")
            .then((response)=> console.log(`productos ${response}`))
            .catch((error) => console.log(`error ${error}`))
        },500)
    }
}