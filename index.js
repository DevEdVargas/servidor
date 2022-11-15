const express = require("express");
const SHA256 = require("crypto-js/sha256");
const port = process.env.PORT || 3000;

const app = express();
var list = []; 

app.use(express.json()); 
app.use(express.urlencoded()); 
app.use(express.static(__dirname + '/public'));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
  
});

app.post("/", (req, res) => {
  class Block {
    constructor(
      index,
      nombreCompleto,
      idUsuario,
      telefonoUsuario,
      previousHash = ""
    ) {
      this.index = index;
      this.date = new Date();
      this.nombreCompleto = nombreCompleto;
      this.idUsuario = idUsuario;
      this.telefonoUsuario = telefonoUsuario;
      this.previousHash = previousHash;
      this.hash = this.createHash();
    }

    createHash() {
      return SHA256(
        this.index +
          this.date +
          this.nombreCompleto +
          this.idUsuario +
          this.telefonoUsuario
   +
          this.previousHash
      ).toString();
    }

  }

  class BlockChain {
    constructor(idOrigen, nombreCompleto, idUsuario) {
      this.chain = [this.createFirstBlock(idOrigen)];
      this.nombreCompleto = nombreCompleto;
      this.idUsuario = idUsuario;
    }

    createFirstBlock(idOrigen) {
      return new Block(0, idOrigen);
    }

    getLasBlock() {
      return this.chain[this.chain.length - 1];
    }

    addBlock(nombreCompleto, idUsuario, telefonoUsuario) {
      let prevBlock = this.getLasBlock();
      let persona = new Block(
        prevBlock.index + 1,
        nombreCompleto,
        idUsuario,
        telefonoUsuario
,
        prevBlock.hash
      );
      console.log(
        "Cliente  " +
          persona.nombreCompleto +
          " y número de ID " +persona.idUsuario
      );
      this.chain.push(persona);
    }
  }

  const blockchain = new BlockChain();

  let nombreUsuario = req.body.nombreUsuario;
  let idUsuario= req.body.idUsuario;
  let telefonoUsuario = req.body.telefonoUsuario;

  blockchain.addBlock(
    nombreUsuario,
    idUsuario,
    telefonoUsuario,
  );
this.list = blockchain.chain;
//res.redirect(req.originalUrl);
});
app.post("/list", (req, res) => {
  console.log(this.list);
  
  res.status(200).jsonp(this.list);
});
app.post("/update", (req, res) => {
  console.log(this.list);
  this.list.forEach(element => {
    if (element.idUsuario===req.body.idUsuario) {
      console.log("usuario encontrado");
      element.nombreCompleto = req.body.nombreCompleto;
      element.idUsuario = req.body.idUsuario;
      element.telefonoUsuario = req.body.telefonoUsuario;
    }
  });
  //
  res.redirect(req.originalUrl);
});
app.listen(port, () => {
  console.log(`Server funcionando en http://localhost:${port}`);
});
