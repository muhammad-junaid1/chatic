#!/usr/bin/env node

(() => {
  const argument = process.argv.slice(2);
  const command = argument[0];

  console.log(command);
})();