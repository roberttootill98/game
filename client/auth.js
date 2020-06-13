// oauth 2.0 functions for clientside
'use strict'

async function login() {
  const url = window.location.href;
  window.location.replace(url + 'google');
}

async function logout() {
  console.log("logging out");

  const response = await fetch('/logout');
  if(response.ok) {
    console.log("logged out");
  } else {
    console.error("failed to log out");
  }
}
