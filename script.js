//Github App Keys.
var client_id = "Iv1.4c8963db6a6c9007";
var client_secret = "c75a415fcfc278264ce9c3bdad653d4cdee7dadf";


//getting the form.
const findUser = document.querySelector('#myForm');

const mainDiv = document.querySelector('.container');

//creating a DIV to show the search results.
const searchResults = document.createElement('div');
searchResults.setAttribute('class','search-result');

mainDiv.appendChild(searchResults);


//displaying files in the repository.
const fetchrepoFiles = (file) => {

    const files = document.querySelector('.file-name');

    files.innerText="";

    const fileOrder = document.createElement('ul');
    fileOrder.setAttribute('class','file-order')
    files.appendChild(fileOrder);

    var fileName = file.tree;
    fileName.forEach((fileName) => {

        const list = document.createElement('li');
        list.innerText = fileName.path;
        fileOrder.appendChild(list);
    })   
}


const repofilesPath = (sha,repoName,userName) => {

    //api url to get list of files in repository branch.
    fetch(`https://api.github.com/repos/${userName}/${repoName}/git/trees/${sha}`,{
        method: "GET"
    })
    .then((data) => data.json())
    .then((user) => fetchrepoFiles(user));
}


const getSHA = (user,repoName,userName,files) => {
    user.forEach((user) => {
        repofilesPath(user.commit.sha,repoName,userName);
    })
}


//getting branch SHA.
const accessUserSHA = (repoName,userName) => {

    fetch(`https://api.github.com/repos/${userName}/${repoName}/branches?client_id=${client_id}&client_secret=${client_secret}`,{
        method: "GET"
    })
    .then((data) => data.json())
    .then((user) => getSHA(user,repoName,userName));
}

//providing list of repositories in the user account.
const getUserRepoName = (repo,userName) => {

    if(typeof(repo.message) === "undefined"){

        const githubRepos = document.createElement('div');
        githubRepos.setAttribute('class','repo-list table-responsive');
    
        const repoTable = document.createElement('table');
        repoTable.setAttribute('class','repo-name table');
    
        searchResults.appendChild(githubRepos);
        githubRepos.appendChild(repoTable);
    
        const files = document.createElement('div');
        files.setAttribute('class','file-name');
        files.innerText = " ** Click on Files in repo button to get list of files available in the repo **";
        searchResults.appendChild(files);
    
        repo.forEach((repo) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${repo.name}</td>
            <td><button class="repo-btn" onclick="accessUserSHA('${repo.name}', '${userName}')">Files in repo</button></td>` //button to get files in the repo.
            repoTable.appendChild(row);
        });
    }
}

const getUserRepo = (userName) => {

    //api url to get list of repos.
    fetch(`https://api.github.com/users/${userName}/repos?client_id=${client_id}&client_secret=${client_secret}`,{
        method: "GET"
    })
    .then((data) => data.json())
    .then((user) => getUserRepoName(user,userName))
}


//appending git user Name and avatar to HTML file.
const gitUserDetails = (user,userName) => {

    if(typeof(user.message) === "undefined"){

        const users = document.createElement('div');
        users.setAttribute('class','users')
        users.innerHTML = `<img src="${user.avatar_url}" class="user-avatar">
        <p class="name-wrapper">${user.name}</p>`
    
        searchResults.appendChild(users);
    }

    else{
        const users = document.createElement('div');
        users.innerHTML = `<p class="user-not-found">Git hub account does not exist for the user <span class="name">${userName}</span></p>`
        searchResults.appendChild(users);
    }
}

const gitUsers = (userName) => {

    //api url to get userName.
    fetch(`https://api.github.com/users/${userName}?client_id=${client_id}&client_secret=${client_secret}`,{
        method: "GET"
    })
    .then((data) => data.json())
    .then((user) => gitUserDetails(user,userName))
}


//form action post form submit.
findUser.addEventListener('submit', (e) => {
    
    searchResults.innerHTML = "";

    //prevent browser default action such as form submit redirection.

    e.preventDefault();

    const userName = document.querySelector('#username').value;//getting the username fron form input.

    gitUsers(userName); // function to get git user's Name.
    getUserRepo(userName); // function to get git user's repo.

    findUser.reset()//resetting the form values post form submit.
});