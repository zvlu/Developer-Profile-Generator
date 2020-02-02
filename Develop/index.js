const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const htmlpdf = require("puppeteer");
const util = require("util");
const renderhtml = require("./generateHTML.js");
const writeFileAsync = util.promisify(fs.writeFile);


function promptUser(){
    return inquirer.prompt([
        {
            type: "list",
            name: "color",
            message: "fav color",
            choices: ["green", "blue", "pink", "red"]
        },
        {
            type: "input",
            name: "username",
            message: "What is your GitHub username?"
        },
      
        
        
    ]);
}



async function generateHTML() {
    try {
       

        let answers = await promptUser();
        const url = `https://api.github.com/users/${answers.username}`;
        let res  = await axios.get(url);
        let stars = await axios.get(url + "/starred"); 
      
        const html = renderhtml.generateHTML(answers,res,stars);

        await writeFileAsync(`index.html`,html);
        
        await writePDF("index.html",html);
        writePDF();
        console.log(res);

        
      
} catch(err) {
    console.log(err);
}




}

 async function writePDF(){
     const browser = await htmlpdf.launch({headless: true, slowMo: 150});
     const page = await browser.newPage();
     const readHTML = fs.readFileSync("index.html","utf8");
     await page.setContent(readHTML);
     await page.pdf({
         path: "bio.pdf",
     });
     console.log("Created");
     await browser.close();
 }
generateHTML();
