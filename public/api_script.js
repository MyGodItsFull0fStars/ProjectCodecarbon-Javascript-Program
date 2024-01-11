var organization_id;
var team_id;
var project_id;
var experiment_id;

var ram = 0;
var ramPower = 0;
var cpu = 0;
var cpuPower = 0;
var esb = 0;

var ramValues = [0.0];
var cpuValues = [0.0];
var esbValues = [0.0];
var xValues = [0];

async function createOrganisation(){
    let name = document.getElementById('name').value;
    let description = document.getElementById('description').value;
    console.log(name);
    console.log(description);

    const response = await fetch('/api/create/organisation', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            description: description
        })
    });

    console.log(response.status);
    console.log(response.statusText);

    if (response.status === 200){
        let data = await response.json();
        organization_id = data.id;
        console.log(organization_id);
        localStorage.setItem("organization_id", organization_id);

        window.location.href = '/api/create/team';
    }
}

function getOrganizationID(){
    organization_id = localStorage.getItem("organization_id");
    document.write(organization_id);
}

async function createTeam(){
    let name = document.getElementById('name').value;
    let description = document.getElementById('description').value;
    console.log(name);
    console.log(description);

    const response = await fetch('/api/create/team', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            description: description,
            organization_id: organization_id
        })
    });

    console.log(response.status);
    console.log(response.statusText);

    if (response.status === 200){
        let data = await response.json();
        team_id = data.id;
        console.log(team_id);

        localStorage.setItem("team_id", team_id);
        window.location.href='/api/create/project';
    }
}

function getTeamID(){
    team_id = localStorage.getItem("team_id");
    document.write(team_id);
}

async function createProject(){
    let name = document.getElementById('name').value;
    let description = document.getElementById('description').value;
    console.log(name);
    console.log(description);

    const response = await fetch('/api/create/project', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            description: description,
            team_id: team_id
        })
    });

    console.log(response.status);
    console.log(response.statusText);

    if (response.status === 200){
        let data = await response.json();
        project_id = data.id;
        console.log(project_id);

        localStorage.setItem("project_id", project_id);
        window.location.href='/api/create/experiment';
    }
}

function getProjectID(){
    project_id = localStorage.getItem("project_id");
    document.write(project_id);
}

async function createExperiment(){
    let name = document.getElementById('name').value;
    let description = document.getElementById('description').value;

    const currentDate = new Date();
    let timeoffset = Math.abs(currentDate.getTimezoneOffset());
    let timeoffsetHour = (timeoffset/60).toString();
    let timeoffsetHourFormat = (timeoffsetHour.length < 2) ? "0" + timeoffsetHour : timeoffsetHour;
    let timeoffsetMinute = (timeoffset%60).toString();
    let timeoffsetMinuteFormat = (timeoffsetMinute.length < 2) ? "0" + timeoffsetMinute : timeoffsetMinute;
    let timestamp = currentDate.getFullYear() + "-" + currentDate.getMonth()+1 + "-" + currentDate.getDay() + "T" + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds() + "+" + timeoffsetHourFormat + ":" + timeoffsetMinuteFormat;
    
    let country_name = document.getElementById('country_name').value;
    let country_iso_code = document.getElementById('country_iso_code').value;
    let region = document.getElementById('region').value;
    let on_cloud = document.getElementById('on_cloud').checked;
    let cloud_provider = document.getElementById('cloud_provider').value;
    let cloud_region = document.getElementById('cloud_region').value;
    
    console.log(name);
    console.log(description);
    console.log("Timestamp: " + timestamp);
    console.log(country_name);
    console.log(country_iso_code);
    console.log(region);
    console.log(on_cloud);
    console.log(cloud_provider);
    console.log(cloud_region);



    const response = await fetch('/api/create/experiment', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            description: description,
            timestamp: timestamp,
            country_name: country_name,
            country_iso_code: country_iso_code,
            region: region,
            on_cloud: on_cloud,
            cloud_provider: cloud_provider,
            cloud_region: cloud_region,
            project_id: project_id
        })
    });

    console.log(response.status);
    console.log(response.statusText);

    if (response.status === 200){
        let data = await response.json();
        experiment_id = data.id;
        console.log(experiment_id);

        localStorage.setItem("experiment_id", experiment_id);
        window.location.href='/api';
    }
}

function getExperimentID(){
    experiment_id = localStorage.getItem("experiment_id");
    document.write(experiment_id);
}

function changeVisibilityCloud(){
    if (on_cloud.checked){
        document.getElementById('label_cp').style.visibility = "visible";
        cloud_provider.style.visibility = "visible";
        document.getElementById('label_cr').style.visibility = "visible";
        cloud_region.style.visibility = "visible";
    }else{
        document.getElementById('label_cp').style.visibility = "hidden";
        cloud_provider.style.visibility = "hidden";
        document.getElementById('label_cr').style.visibility = "hidden";
        cloud_region.style.visibility = "hidden";
    }
}

async function getExperimentData(){
    let response = await fetch("/api/experimentdata");

    console.log(response.status);
    console.log(response.statusText);

    if (response.status === 200){
        let data = await response.json();
        console.log(data);
    }
}

async function getRunData(){
    let response = await fetch("/api/rundata/" + experiment_id);

    console.log(response.status);
    console.log(response.statusText);

    if (response.status === 200){
        let data = await response.json();
        console.log(data);
    }
}

async function getEmissionsData(){
    let run_id = document.getElementById('run_id').value;
    let response = await fetch("/api/emissionsdata/" + run_id);

    console.log(response.status);
    console.log(response.statusText);

    if (response.status === 200){
        let data = await response.json();
        if(data.items.length !== 0){
            console.log(data);
            getCurrentData(data);
            saveDataForChart(data);
        }
        buildLineChart();
    }
}

function getCurrentData(data){
    let values = data.items[0];
    ram = values.ram_energy;
    ramPower = values.ram_power;
    cpu = values.cpu_energy;
    cpuPower = values.cpu_power;
    esb = values.energy_consumed;
    document.getElementById('ram').innerText = ram;
    document.getElementById('ram_power').innerText = ramPower;
    document.getElementById('cpu').innerText = cpu;
    document.getElementById('cpu_power').innerText = cpuPower;
    document.getElementById('esb').innerText = esb;
}

function saveDataForChart(data){
    let items = data.items;
    let item = items[items.length-1];
    ramValues.push(item.ram_energy);
    cpuValues.push(item.cpu_energy);
    esbValues.push(item.energy_consumed);
    for (let index = items.length - 2; index >= 0; index--) {
        let itemBefore = items[index+1];
        item = items[index];
        
    }
}

function calculateTheDiff(currentValue, beforeValue){
    if(currentValue>beforeValue){
            
    }
}

function buildLineChart(){
    //const exampleValues = [0,1,2,3,4,5,6,7,8,9,10];

    new Chart("myChart", {
        type: "line",
        data: {
          labels: xValues,
          datasets: [{
            borderColor: "red",
            label:'RAM',
            data: ramValues,
            fill: false
          },{
            borderColor: "orange",
            label:'CPU',
            data: cpuValues,
            fill: false
          },{
            borderColor: "blue",
            label:'Electricity used since beginning',
            data: esbValues,
            fill: false
          },
        ]},
        options:{}
      });
}