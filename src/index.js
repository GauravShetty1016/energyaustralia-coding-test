import "./stylesheets/index.scss";
import treeView from "./templates/tree_view.hbs";
import errorView from "./templates/error.hbs";
import RecordLabelService from "./services/record_label_service";

async function renderTreeView(rootElement) {
  const recordLabelData = await RecordLabelService.getRecordLabels();

  if (recordLabelData.error) {
    rootElement.innerHTML = errorView(recordLabelData.error);
    return;
  }
  console.log(recordLabelData);
  rootElement.innerHTML = treeView({ recordLabels: recordLabelData });
}

renderTreeView(document.getElementById("root"));
