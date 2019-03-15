var config = {
  db_host: "mongodb://localhost:27017/",
  db_name: "dst",
  api_port: "4000",
  shard_db: false,
  base_url: "/api",
  uploadPath: "Shared",
  option: {
    useNewUrlParser: true
  }
  //Log config
};

module.exports = config;
