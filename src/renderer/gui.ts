import * as path from 'path';
import * as fs from 'fs';



export function run() {

    let projectUserPick = path.resolve(__dirname, "../../config");
    let configPath = path.join(projectUserPick, "data.config");
    let data:any;
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

    var canvas = document.getElementById("app") as HTMLCanvasElement;
    //var stage = angel.run(canvas);

    Controller.getInstance().createData(data);
    //模拟删除
    Controller.getInstance().deleteData(1);
    var view = new View();
    //view.show(stage);
    

    

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
        this.content = "装备:" + this.prefixion + "之" + this.name;
    }

}

class View{


    show(stage){

        var x = 10;
        var y = 0;
        var change = 10;
        
        for(var i = 0; i < Controller.getInstance().equipmentArray.length; i++){
            
            var textField = new angel.TextField();
            textField.text = Controller.getInstance().equipmentArray[i].content;
            textField.y = y + change;
            stage.addChild(textField);
        }
    }

}






