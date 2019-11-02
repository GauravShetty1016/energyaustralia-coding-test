import { assert, expect } from "chai";
import moxios from "moxios";
import RecordLabelService from "../src/services/record_label_service";

describe("Record Label Services", function() {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it("Should have a function", function() {
    assert.isFunction(RecordLabelService.getRecordLabels, "returns record label data");
  });

  it("Should return null when the server does not return any data", function(done) {
    moxios.wait(function() {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: []
      });
    });
    RecordLabelService.getRecordLabels()
      .then(data => {
        expect(data).to.be.undefined;
      })
      .then(done, done);
  });

  it("Should reject the promise when there is an error", function(done) {
    moxios.wait(function() {
      let request = moxios.requests.mostRecent();
      request.reject({
        response: { status: 429, error: "Throttled" }
      });
    });

    RecordLabelService.getRecordLabels()
      .then(e => {
        const error = e.error;
        expect(error).to.have.property("status");
        expect(error).to.have.property("message");
        expect(error.status).to.equal(429);
        expect(error.message).to.be.equal("The request has been throttled");
      })
      .then(done, done);
  });

  describe("Structure of the returned data", function() {
    beforeEach(() => {
      const festivalData = [
        {
          name: "LOL-palooza",
          bands: [
            { name: "Jill Black", recordLabel: "Fourth Woman Records" },
            { name: "Werewolf Weekday", recordLabel: "XS Recordings" },
            { name: "Winter Primates", recordLabel: "" },
            { name: "Frank Jupiter", recordLabel: "Pacific Records" }
          ]
        },
        {
          name: "Small Night In",
          bands: [
            { name: "Wild Antelope", recordLabel: "Marner Sis. Recording" },
            { name: "Squint-281", recordLabel: "Outerscope" },
            { name: "The Black Dashes", recordLabel: "Fourth Woman Records" },
            { name: "Green Mild Cold Capsicum", recordLabel: "Marner Sis. Recording" },
            { name: "Yanke East", recordLabel: "MEDIOCRE Music" }
          ]
        }
      ];

      moxios.wait(function() {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: festivalData
        });
      });
    });

    it("Should have the correct keys", function(done) {
      RecordLabelService.getRecordLabels()
        .then(data => {
          const record = data[0];
          expect(data).to.have.lengthOf(7);
          expect(record).to.have.property("name");
          expect(record).to.have.property("bands");
          expect(record.bands).to.be.an("array");
          expect(record).to.have.nested.property("bands[0].festivals");
          expect(record).to.have.nested.property("bands[0].name");
          expect(record.bands[0].festivals).to.be.an("array");
        })
        .then(done, done);
    });
  });
});
