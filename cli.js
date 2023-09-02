#!/usr/bin/env node

import inquirer from "inquirer";
import io from "socket.io-client";
import ora from "ora";
import chalk from "chalk";

const backendURL = "http://localhost:5000";

(() => {
 const socket = io(backendURL);
 inquirer.prompt([
    {
        type: "input", 
        name: "username", 
        message: "Enter your username: "
    }
 ]).then((result) => {
    const spinner = ora(`Hold on! Connecting you to the world`).start();
    const username = result?.username;

    socket.emit("chatic_add-user", username);
    socket.on("chatic_user-added", (data) => {
        if(data?.status) {
            setTimeout(() =>{
                spinner.stop();

                inquirer.prompt([
                    {
                        type: "list", 
                        name: "Options", 
                        choices: [
                            "1. One-to-One Random Chat"
                        ]
                    }
                ]).then((result) => {
                    const choice = result?.Options;
                    console.log(choice);
                })
            }, 2000);
        } else {
            console.log(chalk.redBright(data?.message));
        }
    })
 })
})();