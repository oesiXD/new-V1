import express from "express";
import { Server as HTTPServer } from "http";
import path from "path";

class Server {

  public app!: express.Application;
  private readonly DEFAULT_PORT_SERVER =
    process.env.DEFAULT_PORT_SERVER || 3003;
  private httpServer!: HTTPServer;
  
  constructor() {
      this.configExpress();
      this.configResourcesDirectory();
      this.configEjsTemplateEngine();
      this.createServer();
  }
  
  
  private configExpress() {
      //Creamos nuestro servidor express
    this.app = express();
  }

  private configResourcesDirectory() {
    this.app.use(express.static(path.join(__dirname, "public"))); 
  }

  private configEjsTemplateEngine() {
    this.app.set( "views", path.join( __dirname, "views" ) );
    this.app.set( "view engine", "ejs" );
  }

  private createServer() {
    this.httpServer = new HTTPServer(this.app);
  }

  listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT_SERVER, () => {
      callback(+this.DEFAULT_PORT_SERVER);
    });
  }
}

export default Server;
