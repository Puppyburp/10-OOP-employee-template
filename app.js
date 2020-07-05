// dependencies
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const render = require("./lib/htmlRenderer");
// questions for all
const allQuestions = [{
  type: "input",
  message: "Team member name:",
  name: "name",
},
{
  type: "number",
  message: "Team member id:",
  name: "id",
},
{
  type: "input",
  message: "Email address:",
  name: "email",
}];
// manager specific question
const mgrQuestions = [{
  type: "input",
  message: "Manager's office number:",
  name: "officeNumber",
}];
// engineer specific question
const engQuestions = [{
  type: "input",
  message: "Engineer's GitHub name:",
  name: "github",
}];
// intern specific question
const intQuestions = [{
  type: "input",
  message: "Intern's school:",
  name: "school",
}];

let allQ = [];
const manager = [];
const engineer = [];
const intern = [];

function getRole() {
    inquirer.prompt(
        {
            type: "list",
            message: "What type of team member would you like to add?",
            name: "position",
            choices: [
                "Manager",
                "Engineer",
                "Intern",
                "Finished"
            ],
        }

    ).then(function (data) {
        console.log(data.position) 
        if (data.position === "Finished") {
            renderHTML();
        }
        else if (data.position === "Manager") {
            allQ = [...allQuestions, ...mgrQuestions];
            getData(data.position);
        }
        else if (data.position === "Engineer") {
            allQ = [...allQuestions, ...engQuestions];
            getData(data.position);
        }
        else if (data.position === "Intern") {
            allQ = [...allQuestions, ...intQuestions];
            getData(data.position);
        }
    });
}

function getData(position) {
    inquirer.prompt(allQ)
        .then(function (data) {
        const {name, id, email, officeNumber, github, school} = data;
        switch (position) {
            case "Manager":
                manager.push(new Manager(name, id, email, officeNumber));
                break;
            case "Engineer":
                engineer.push(new Engineer(name, id, email, github));
                break;
            case "Intern":
                intern.push(new Intern(name, id, email, school));
                break;
        }
        console.log(manager);
        console.log(engineer);
        console.log(intern);
        getRole();
    });

}
async function renderHTML(){
  try {
      const employees = [...manager, ...engineer, ...intern];
      const pageContent = await render(employees);
      fs.writeFile("output/employee-summary.html", pageContent, err => {
          if (err){
              return console.log(err);
          }
          console.log("Success! Your file has been created!");
      });
  }
  catch (err) {
      console.log(err);
  }
}

getRole();