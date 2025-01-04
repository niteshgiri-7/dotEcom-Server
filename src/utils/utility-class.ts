
class ErrorHandler extends Error{
       constructor(public errMsg:string,public statusCode:number){
        super(errMsg);
        this.statusCode=statusCode;
       }
}


export default ErrorHandler;