//----------------------------------------------
//Atributos
//----------------------------------------------
/*
permite escritura y lectura de archivos
*/
let fs = require('fs');

/*
obtiene componente express
*/
let express = require('express');

/*
obtiene componente de descarga de archivos rapido.
*/
const axios = require('axios');

/*
me permite usar express
*/
let app = express();

/*
url del JSON
*/
const url = 'https://gist.githubusercontent.com/josejbocanegra/c6c2c82a091b880d0f6062b0a90cce88/raw/abb6016942f7db2797846988b039005c6ea62c2f/categories.json';


async function cargar(callback) {
    let resp = await axios.get(url);
    cargarHtml(resp.data, callback);
}

async function cargarHtml(data, callback) {
    fs.readFile('index.html', (err, html) => {
        if (err) throw err;
        let cadena = '';
        let t = true;
        data.forEach((prod, index) => {

            let cad2 = '';

            prod.products.forEach((prod2, index) =>{
                cad2 +=`
                <div class="card shadow p-3 mb-5 bg-white rounded" style="width: 18rem;">
                <img src="${prod2.image}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${prod2.name}[$${prod2.price}]</h5>
                  <p class="card-text">${prod2.description}</p>
                  <a href="" class="btn btn-primary">Add To Card</a>
                </div>
              </div>
              <br>`;
            });
            cadena += `
            <div class="card">
            <div class="card-header" id="${prod.name.replace(/ /g, '')}a">
              <h2 class="mb-0">
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#${prod.name.replace(/ /g, '')}" aria-expanded="${t}" aria-controls="${prod.name.replace(/ /g, '')}">
                  ${prod.name.replace(/ /g, '')}
                </button>
              </h2>
            </div>
        
            <div id="${prod.name.replace(/ /g, '')}" class="collapse" aria-labelledby="${prod.name.replace(/ /g, '')}a" data-parent="#accordionExample">
            <br>
            ${cad2}
            </div>
          </div>`;
            t = false; 
        });
        let mod = html.toString().replace('PLACEHOLDER', cadena);
        callback(mod);
    });
}


//Me pone a escuchar el servidor en el puerto xxxx
app.listen(8081);



//lo que envio al cliente
let servir = function (data) {
    app.get('/', (request, res) => {
        res.send(data);

    });
}

cargar(servir);