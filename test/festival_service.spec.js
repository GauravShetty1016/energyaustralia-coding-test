import { assert, expect } from "chai";
import moxios from "moxios";
import FestivalService from "../src/services/festival_service";

describe("Festival Services", function() {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it("Should have a function", function() {
    assert.isFunction(FestivalService.getFestivals, "returns festivals data");
  });

  it("Should send a request to festivals endpoint", function(done) {
    moxios.wait(function() {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: []
      });
    });
    FestivalService.getFestivals()
      .then(data => {
        expect(data.data).to.be.empty;
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
    FestivalService.getFestivals()
      .then(() => {})
      .catch(e => {
        expect(e.response).to.have.property("status");
        expect(e.response).to.have.property("error");
        expect(e.response.status).to.equal(429);
      })
      .then(done, done);
  });
});
