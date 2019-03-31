// this code is used if  server givs 404 status

export default (ReplicateResponse = {
  WithinRange: {
    x_max: 120,
    x_min: 0,
    y_max: 120,
    y_min: 0,
    datasets: []
  },
  BelowRange: {
    x_max: 120,
    x_min: 0,
    y_max: 120,
    y_min: 0,
    datasets: []
  },
  AboveRange: {
    x_max: 120,
    x_min: 0,
    y_max: 120,
    y_min: 0,
    datasets: []
  }
});
