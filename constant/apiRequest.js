var apiRequest = {
  post: {
    createCompany: {
      url: "/company",
      vFlag: 0,
      mandatory: []
    },
    displayReport: {
      url: "/Report",
      vFlag: 0,
      mandatory: []
    },
    upload: {
      url: "/Report",
      vFlag: 0,
      mandatory: []
    },
    getRange: {
      url: "/getrange",
      vFlag: 0,
      mandatory: []
    },
    AuditTrail: {
      url: "/AuditTrail",
      vFlag: 0,
      mandatory: []
    },
    SummaryReport: {
      url: "/SummaryReport",
      vFlag: 0,
      mandatory: []
    }
  },
  get: {
    helloRequest: {
      url: "/hello",
      vFlag: 0,
      mandatory: []
    },
    TestPython: {
      url: "/HelloPython",
      vFlag: 0,
      mandatory: []
    },
    displayReport: {
      url: "/report2",
      vFlag: 0,
      mandatory: []
    },
    uploadForm: {
      url: "/UploadForm",
      vFlag: 0,
      mandatory: []
    }
  }
};

module.exports = apiRequest;
