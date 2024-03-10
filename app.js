document.addEventListener("readystatechange", function () {

    fetchData();

    function fetchData() {
        const spinner = document.getElementById('loading-spinner');
        spinner.style.display = 'block'; // Shows the loading spinner

        const apiKey = 'a90a3a10';
        const apiUrl = `https://my.api.mockaroo.com/country_api.json?key=${apiKey}`;

        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayData(data);
                spinner.style.display = 'none'; //Hides loading spinner after fetch
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                spinner.style.display = 'none';
            });
    }

     // Kod filtra dla tabeli
     function filterTable(searchTerm) {
        const table = document.querySelector('.table-bordered');
        const rows = table.getElementsByTagName('tr');
  
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let rowText = '';
  
            for (let j = 0; j < cells.length; j++) {
                rowText += cells[j].textContent.toLowerCase() + ' ';
            }
  
            if (rowText.includes(searchTerm.toLowerCase())) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
  







    function displayData(data) {
        const dataContainer = document.getElementById('data-container');



             
        // pole wyszukiwania
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.placeholder =' Search';
      searchInput.addEventListener('input', function () {
        filterTable(this.value);
      });
      dataContainer.appendChild(searchInput);
        
        if (Array.isArray(data) && data.length > 0) {
            
            const table = document.createElement('table');
            table.className = 'table table-bordered';

            
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            //DJ to keep data for charts
            const arrCountryPopulation =[];
            let intMonumentCounterYes = 0;
            let intMonumentCounterNo = 0;
            Object.keys(data[0]).forEach(key => {
                const th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);

            });
            
            

            thead.appendChild(headerRow);
            table.appendChild(thead);

            
            const tbody = document.createElement('tbody');
            let i = 0

            data.forEach(item => {
                const row = document.createElement('tr');
                
                //DJ get data for charts
                arrCountryPopulation[i] = []
                arrCountryPopulation[i][0]=item["country_name"];
                arrCountryPopulation[i][1]=item["population"];
                if (item["has_national_monument"] == true) {
                  intMonumentCounterYes++;
                }
                else{
                  intMonumentCounterNo++;
                }

                Object.values(item).forEach(value => {
                    const td = document.createElement('td');
                    td.textContent = value;
                    row.appendChild(td);  
                });

                i = i + 1;
                tbody.appendChild(row);
            });
            
            table.appendChild(tbody);

            
            dataContainer.appendChild(table);

            //DJ create a chart
            CreatechartCountryPopulation(arrCountryPopulation); 
            CreatechartMonument(intMonumentCounterYes,intMonumentCounterNo);
        } else {

            dataContainer.textContent = 'No data available.';
        }
        
    }

    //create a bar chart of top 10 countries by population
    function CreatechartCountryPopulation(arrCountryPopulation){

        const countries = [];
        const population = [];

        arrCountryPopulation.sort(SortPopulation);
        
        function SortPopulation(a, b) {
            return b[1]-a[1]
        }

        for (let i = 0; i < 10; i++) {
            countries[i] = arrCountryPopulation[i][0];
            population[i] = arrCountryPopulation[i][1];
        };

        const ctx = document.getElementById('CountryPopulationChart');
        new Chart(ctx, {
          type: 'bar',
          
          data: {
            labels: countries,
            
            datasets: [{
              backgroundColor: 'rgb(84,179,214)',
              label: 'Population',
              data: population,
              borderWidth: 0
              
            }]
          },
          options: {
            
            scales: {
              y: {
                min: arrCountryPopulation[0][1]*50/100, //to better reflect differences
                ticks:{
                  color: 'rgb(0,0,0)'
                }
              },
              x:{
                ticks:{
                  color: 'rgb(0,0,0)'
                }
              }
              
            },
            plugins: {
              legend: {
                labels: {
                  color: 'rgb(0,0,0)'
                }
              }
              
            }
          }
          
          
        });
    }
    
    //creates Pie chart for monuments
    function CreatechartMonument(intMonumentCounterYes,intMonumentCounterNo){

      
      // dane do wykresu
      const data = {
        labels: ["Yes", "No"],
        datasets: [
          {
            borderWidth: 0,
            label: 'Count',
            data: [intMonumentCounterYes,intMonumentCounterNo],
            backgroundColor: [
              'rgb(174, 214, 241)',
              'rgb(84,179,214)'
            ],
          }
        ]
      };

      //wykres kołowy
      const ctx = document.getElementById('MonumentsChart');
        new Chart(ctx, {
          type: 'pie',
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                
                labels:{
                  color: 'rgb(0,0,0)',
                }
              },
              title: {
                display: true,
                text: 'Has National Monument?',
                color: 'rgb(0,0,0)'
              }
            }
          },
        });
        
    }
})


//pobieranie tabeli 

function downloadTableAsFile() {
  const dataContainer = document.getElementById('data-container');
  const table = dataContainer.querySelector('table');

  if (!table) {
      console.error("Table not found");
      return;
  }

  const tableHTML = table.outerHTML;
  const blob = new Blob([tableHTML], { type: 'text/html' });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'table.html';
  a.style.display = 'none';
  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}


// przewijanie strony do samego dołu 

function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}




