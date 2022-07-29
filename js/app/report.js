function report_select(volume_id) {
    //console.log(volume_id);

    // select post
    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'report/?volume_id=' + volume_id,
        dataType: 'json',
        success: function(msg) {
            console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                $('#tab-reports-volume-title').text(msg.data.volume.volume_title);
                $('#tab-reports-volume-summary').text(msg.data.volume.volume_summary);
                $('#tab-reports-volume-currency').text(msg.data.volume.volume_currency);
                $('#tab-reports-volume-sum').text(msg.data.volume.volume_sum);
                $('#tab-reports-posts-count').text(msg.data.volume.meta.posts_count);
                $('#tab-reports-uploads-count').text(msg.data.volume.meta.uploads_count);
                
                let data = {
                    labels: msg.data.posts_data.labels,
                    datasets: [
                      {
                        label: 'Income',
                        data: msg.data.posts_data.income_data,
                        backgroundColor: '#228B22',
                      },
                      {
                        label: 'Outcome',
                        data: msg.data.posts_data.outcome_data,
                        backgroundColor: '#DC143C',
                      }
                    ]
                  };

                
            
                let config = {
                    type: 'bar',
                    data: data,
                    options: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: false,
                          },
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        xAxes: [{
                          stacked: true,
                          ticks: { display: false },
                          gridLines : { display : false },
                        }],
                        yAxes: [{
                          stacked: true
                        }]
                      },
                    }
                  };

                let myChart = new Chart(
                    document.getElementById('myChart'),
                    config
                );

                // ----------------- INCOME DONUT -----------------
                data = {
                    labels: msg.data.categories_data.income.labels,
                    datasets: [{
                      label: 'income',
                      data: msg.data.categories_data.income.data,
                      backgroundColor: ['#228B22', '#006400', '#556B2F', '#ADFF2F', '#008000', '#7CFC00', '#90EE90', '#32CD32', '#3CB371', '#00FA9A', '#98FB98', '#2E8B57', '#00FF7F', '#9ACD32'],
                      hoverOffset: 4
                    }]
                  };

                config = {
                    type: 'doughnut',
                    data: data,
                };

                let myChart2 = new Chart(
                    document.getElementById('myChart2'),
                    config
                );

                // ------------------ OUTCOME DONUT ------------------
                let donut_outcome_data = {
                    labels: msg.data.categories_data.outcome.labels,
                    datasets: [{
                      label: 'outcome payments',
                      data: msg.data.categories_data.outcome.data,
                      backgroundColor: ['#DC143C', '#B22222', '#8B0000', '#CD5C5C', '#FF4500', '#FF0000', '#FF6347', '#FA8072', '#FFA07A', '#FFB6C1', '#F08080', '#A52A2A'],
                      hoverOffset: 4
                    }]
                  };

                let donut_outcome_config = {
                    type: 'doughnut',
                    data: donut_outcome_data,
                };

                let myChart3 = new Chart(
                    document.getElementById('myChart3'),
                    donut_outcome_config
                );

            }
            
        },
        error: function(xhr, status, error) {}
    });
}
