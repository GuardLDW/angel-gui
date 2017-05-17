import * as path from 'path';
import * as fs from 'fs';
import * as cp from "child_process";



export let run = () => {

    let canvas = document.getElementById("app") as HTMLCanvasElement;
    let stage = angel.run(canvas);
    let data : any;
    let dataa : any;

    let projectUserPick = path.resolve(__dirname, "../../../angel-gui");

    console.log(projectUserPick);
    if (!validProject(projectUserPick)) {
        alert("不是一个有效的Unity项目");
    }
    else {
        let child_process = cp.exec("angel " + 'run ' + projectUserPick);
        let iframe: HTMLIFrameElement;
        child_process.stdout.addListener("data", data => {
            console.log(data.toString());
            setTimeout(() => {
                if (data.toString().indexOf("Server listening to") >= 0) {
                    iframe = document.getElementById("iframe") as HTMLIFrameElement;
                    iframe.src = "http://localhost:1337/index.html";
                }
            }, 500);
        })

    }

    //输入的是项目路径
    function validProject(projectUserPick: string) {

        // return true;
        var ValidCredential = path.join(projectUserPick, "angel.json")
        //文件存在
        if (!fs.existsSync(ValidCredential)) {
            alert("不是一个Unity项目,缺少json文件");
            return false;
        }
        //文件是否合法
        let dataaContent = fs.readFileSync(ValidCredential, "UTF-8");
        try {
            dataa = JSON.parse(dataaContent);
        }
        catch (e) {
            alert("解析JSON文件出现问题");
        }
        if (dataa) {
            let enginedir: string = dataa.engine;
            if (!enginedir) {
                alert("不是一个Unity项目")
                return false;
            }
        }
        return true;
    }

    let projectUserPick1 = path.resolve(__dirname, "../../config");
    let configPath = path.join(projectUserPick, "data.config");
    if (!fs.existsSync(configPath)) {
        alert("该文件夹不是有效路径");
    }else{
        let dataContent = fs.readFileSync(configPath, "utf-8");
        try {
            data = JSON.parse(dataContent);
        }
        catch (e) {
            alert("配置文件解析失败！")
        }
    }

    

    Controller.getInstance().createData(data);
    //模拟删除
    Controller.getInstance().deleteData(1);
    var view = new View();
    view.show(stage);
    

    

}
 

class Controller{

    static instance : Controller;

    equipmentArray : Equipment[];

    equipmentData;

    constructor(){

        this.equipmentArray = new Array();
    }

    static getInstance() : Controller{

        if(!Controller.instance){

            Controller.instance = new Controller();
            return Controller.instance;
        }else{

            return Controller.instance;
        }
    }

    createData(data){
        
        this.equipmentData = data;
        for(var i = 0; i < data.equipments.length; i++){

            var equipment = new Equipment(data.equipments[i].id, data.equipments[i].name, data.equipments[i].prefixion);
            this.equipmentArray.push(equipment);
        }
    }
    

    addData(equipment : Equipment){

        this.equipmentArray.push(equipment);
        this.changeConfig();
    }

    deleteData(id : number){

        for(var i = 0; i < this.equipmentArray.length; i++){

            if(id == this.equipmentArray[i].id){

                this.equipmentArray.splice(i,1);
            }
        }
        this.changeConfig();
    }

    alterData(id : number){

        //data......
        this.changeConfig();
    }
                             
    queryData(id : number){

        //data......
        this.changeConfig();
    }

    //改变配置文件内容
    changeConfig(){
        
        this.equipmentData.equipments = this.equipmentArray;//!!!!
        let dataContent = JSON.stringify(this.equipmentData, null, "\t");
        fs.writeFileSync(path.join(path.resolve(__dirname, "../../config"), "data.config"), dataContent, "utf-8");
    }

}
        
       


class Equipment{

    id : number;
    name : string;
    prefixion : string;
    content : string;

    constructor(id : number, name : string, prefixion : string){

        this.id = id;
        this.name = name;
        this.prefixion = prefixion;
        if(this.prefixion == "无"){
            
            this.content = "装备:" + this.name;
        }else{
            
            this.content = "装备:" + this.prefixion + "之" + this.name;
        }

    }

}



class View{

    show(stage){

        var x = 10;
        var y = 30;
        var change = 40;
        
        for(var i = 0; i < Controller.getInstance().equipmentArray.length; i++){
            
            var textField = new angel.TextField();
            textField.text = Controller.getInstance().equipmentArray[i].content;
            textField.size = 20;
            textField.y = y + change * i;
            textField.addEventListener("onclick", function(){

                alert(textField.text);

            }, textField, false);
            stage.addChild(textField);
        }
    }

}






