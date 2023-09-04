#!/usr/bin/env node

import inquirer from "inquirer";
import io from "socket.io-client";
import ora from "ora";
import chalk from "chalk";

const backendURL = "http://localhost:5000";

(() => {
  const socket = io(backendURL);
  inquirer
    .prompt([
      {
        type: "input",
        name: "username",
        message: "Enter your username: ",
      },
    ])
    .then((result) => {
      const username = result?.username;

      inquirer
        .prompt([
          {
            type: "list",
            name: "Options",
            choices: ["1. One-to-One Random Chat"],
          },
        ])
        .then((result) => {
          const choice = result?.Options;
          socket.emit("chatic_add-user", username);
          const spinner = ora("Connecting you to our servers!").start();
          socket.on("chatic_user-added", (data) => {
            if (data?.status) {
              setTimeout(() => {
                spinner.stop();
                const { user1, user2 } = data?.room;

                const connectedTo =
                  user1?.username === username
                    ? user2?.username
                    : user1?.username;
                console.log("\n");
                console.log(`Connected to: ${chalk.blueBright(connectedTo)}`);
              }, 2000);
            } else {
              console.log(chalk.redBright(data?.message));
            }
          });
        });
    });
})();
