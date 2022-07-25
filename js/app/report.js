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

                let labels = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                ];
                
                let data = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'First dataset',
                            borderColor: 'rgb(255, 99, 132)',
                            data: [0, 10, 5, 2, 20, 30, 45],
                        }, {
                            label: 'Second dataset',
                            backgroundColor: 'rgb(99, 255, 132)',
                            borderColor: 'rgb(99, 255, 132)',
                            data: [10, 5, 55, 20, 0, 50, 15],
                        }
                    ]
                };
            
                let config = {
                    type: 'line',
                    data: data,
                    options: {
                        responsive:true,
                        maintainAspectRatio: false,
                    }
                };

                let myChart = new Chart(
                    document.getElementById('myChart'),
                    config
                );

                // ----------------- DONUT -----------------

                data = {
                    labels: [
                      'Red',
                      'Blue',
                      'Yellow'
                    ],
                    datasets: [{
                      label: 'My First Dataset',
                      data: [300, 50, 100],
                      backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                      ],
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


                /*
                let labels = [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ];

                let data = [
                    {
                      label: "work load",
                      data: [2, 9, 3, 17, 6, 3, 7],
                      backgroundColor: "rgba(153,205,1,0.6)",
                    },
                    {
                      label: "free hours",
                      data: [2, 2, 5, 5, 2, 1, 10],
                      backgroundColor: "rgba(155,153,10,0.6)",
                    },
                ];

                let config = {
                    type: 'line',
                    data: data,
                    options: {}
                  };

                var ctx = document.getElementById("myChart").getContext("2d");
                var myChart = new Chart(ctx, {
                  type: "line",
                  data: {
                    labels: labels,
                    datasets: data,
                  },
                });
                */
            }
            
        },
        error: function(xhr, status, error) {}
    });
}
