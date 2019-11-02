import "./stylesheets/index.scss";
import treeView from "./templates/tree_view.hbs";
import errorView from "./templates/error.hbs";
import RecordLabelService from "./services/record_label_service";
import _ from "lodash";

async function renderTreeView(rootElement) {
  const recordLabelData = await RecordLabelService.getRecordLabels();

  if (_.isEmpty(recordLabelData)) {
    rootElement.innerHTML = treeView({ emptyList: true });
    return;
  }

  if (recordLabelData.error) {
    rootElement.innerHTML = errorView(recordLabelData.error);
    return;
  }
  rootElement.innerHTML = treeView({ recordLabels: recordLabelData });
}

renderTreeView(document.getElementById("root"));
