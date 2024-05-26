import * as path from "path";
import * as fs from "fs";

const componentsPath = path.join(
  __dirname,
  "..",
  "src",
  "frontend",
  "components",
);

const pagesPath = path.join(__dirname, "..", "src", "frontend", "pages");

// Generate the list component
const reference = {
  name: "serviceAccount",
  title: "Service Account",
  pathName: "service-accounts",
  pathSingular: "service-account",
  pascalCase: "ServiceAccount",
  tsType: "V1ServiceAccount",
};
const resource = {
  name: "configMap",
  title: "Config Map",
  pathName: "config-maps",
  pathSingular: "config-map",
  pascalCase: "ConfigMap",
  tsType: "V1ConfigMap",
};

function createListComponent() {
  const listRefPath = path.join(componentsPath, `${reference.pathName}-list`);
  const listComponentPath = path.join(
    componentsPath,
    `${resource.pathName}-list`,
  );
  console.log("Checking if component already exists");
  const directoryExists = fs.existsSync(listComponentPath);
  if (directoryExists) {
    console.error(
      `List component directory already exists: ${listComponentPath}`,
    );
    return;
  }
  console.log("component doens't exist, copying it now");
  fs.cpSync(listRefPath, listComponentPath, {
    recursive: true,
  });

  console.log("Files copied successfully, renaming files now");
  fs.renameSync(
    path.join(listComponentPath, `${reference.pathName}-list.tsx`),
    path.join(listComponentPath, `${resource.pathName}-list.tsx`),
  );
  console.log("Files renamed successfully, updating files now");

  console.log("Updating files: index.ts");
  const indexFilePath = path.join(listComponentPath, "index.ts");
  const indexFile = fs.readFileSync(indexFilePath, "utf-8");
  const updatedIndexFile = indexFile
    .replace(new RegExp(reference.pathName, "g"), resource.pathName)
    .replace(new RegExp(reference.name, "g"), resource.name)
    .replace(new RegExp(reference.pascalCase, "g"), resource.pascalCase);
  fs.writeFileSync(indexFilePath, updatedIndexFile);
  console.log("Updating files: index.ts completed. Updating columns.ts");

  const columnsFilePath = path.join(listComponentPath, "columns.ts");
  const columnsFile = fs.readFileSync(columnsFilePath, "utf-8");
  const updatedColumnsFile = columnsFile
    .replace(new RegExp(reference.tsType, "g"), resource.tsType)
    .replace(new RegExp(reference.name, "g"), resource.name)
    .replace(new RegExp(reference.pascalCase, "g"), resource.pascalCase);
  fs.writeFileSync(columnsFilePath, updatedColumnsFile);
  console.log(
    `Updating files: columns.ts completed. updating ${resource.pathName}-list.tsx`,
  );

  const listComponentFilePath = path.join(
    listComponentPath,
    `${resource.pathName}-list.tsx`,
  );
  const listComponentFile = fs.readFileSync(listComponentFilePath, "utf-8");
  const updatedListComponentFile = listComponentFile
    .replace(new RegExp(reference.tsType, "g"), resource.tsType)
    .replace(new RegExp(reference.name, "g"), resource.name)
    .replace(new RegExp(reference.pascalCase, "g"), resource.pascalCase);
  fs.writeFileSync(listComponentFilePath, updatedListComponentFile);

  console.log("Files updated successfully. exporting component");
  const componentsIndexFilePath = path.join(
    listComponentPath,
    "..",
    "index.ts",
  );
  fs.appendFileSync(
    componentsIndexFilePath,
    `\nexport * from "./${resource.pathName}-list";\n`,
  );
  console.log("Component exported successfully");
}

function createListPage() {
  const pageRefPath = path.join(pagesPath, `${reference.pathName}-list-page`);
  const pageComponentPath = path.join(
    pagesPath,
    `${resource.pathName}-list-page`,
  );
  console.log("Checking if page already exists");
  const directoryExists = fs.existsSync(pageComponentPath);
  if (directoryExists) {
    console.error(`List page directory already exists: ${pageComponentPath}`);
    return;
  }
  console.log("page doens't exist, copying it now");
  fs.cpSync(pageRefPath, pageComponentPath, {
    recursive: true,
  });

  console.log("Files copied successfully, renaming files now");
  fs.renameSync(
    path.join(pageComponentPath, `${reference.pathName}-list-page.tsx`),
    path.join(pageComponentPath, `${resource.pathName}-list-page.tsx`),
  );
  console.log("Files renamed successfully, updating files now");

  console.log("Updating files: index.ts");
  const indexFilePath = path.join(pageComponentPath, "index.ts");
  const indexFile = fs.readFileSync(indexFilePath, "utf-8");
  const updatedIndexFile = indexFile
    .replace(new RegExp(reference.pathName, "g"), resource.pathName)
    .replace(new RegExp(reference.name, "g"), resource.name)
    .replace(new RegExp(reference.pascalCase, "g"), resource.pascalCase);
  fs.writeFileSync(indexFilePath, updatedIndexFile);
  console.log(
    `Updating files: index.ts completed. updating ${resource.pathName}-list-page.tsx`,
  );

  const listPageFilePath = path.join(
    pageComponentPath,
    `${resource.pathName}-list-page.tsx`,
  );
  console.log(listPageFilePath);
  const listPageFile = fs.readFileSync(listPageFilePath, "utf-8");
  const updatedListPageFile = listPageFile
    .replace(new RegExp(reference.tsType, "g"), resource.tsType)
    .replace(new RegExp(reference.name, "g"), resource.name)
    .replace(new RegExp(reference.pascalCase, "g"), resource.pascalCase)
    .replace(new RegExp(reference.pathName, "g"), resource.pathName)
    .replace(new RegExp(reference.title, "g"), resource.title);

  fs.writeFileSync(listPageFilePath, updatedListPageFile);

  console.log("Files updated successfully. exporting page");
  const pagesIndexFilePath = path.join(pageComponentPath, "..", "index.ts");
  fs.appendFileSync(
    pagesIndexFilePath,
    `\nexport * from "./${resource.pathName}-list-page";\n`,
  );
  console.log("Page exported successfully");
}

function createDetailsPage() {
  const pageRefPath = path.join(
    pagesPath,
    `${reference.pathSingular}-details-page`,
  );
  const pageComponentPath = path.join(
    pagesPath,
    `${resource.pathSingular}-details-page`,
  );
  console.log("Checking if page already exists");
  const directoryExists = fs.existsSync(pageComponentPath);
  if (directoryExists) {
    console.error(
      `details page directory already exists: ${pageComponentPath}`,
    );
    return;
  }
  console.log("page doens't exist, copying it now");
  fs.cpSync(pageRefPath, pageComponentPath, {
    recursive: true,
  });

  console.log("Files copied successfully, renaming files now");
  fs.renameSync(
    path.join(pageComponentPath, `${reference.pathSingular}-details-page.tsx`),
    path.join(pageComponentPath, `${resource.pathSingular}-details-page.tsx`),
  );
  console.log("Files renamed successfully, updating files now");

  console.log("Updating files: index.ts");
  const indexFilePath = path.join(pageComponentPath, "index.ts");
  const indexFile = fs.readFileSync(indexFilePath, "utf-8");
  const updatedIndexFile = indexFile
    .replace(new RegExp(reference.pathName, "g"), resource.pathName)
    .replace(new RegExp(reference.pathSingular, "g"), resource.pathSingular)
    .replace(new RegExp(reference.name, "g"), resource.name)
    .replace(new RegExp(reference.pascalCase, "g"), resource.pascalCase);
  fs.writeFileSync(indexFilePath, updatedIndexFile);
  console.log(
    `Updating files: index.ts completed. updating ${resource.pathName}-list-page.tsx`,
  );

  const detailsPageFilePath = path.join(
    pageComponentPath,
    `${resource.pathSingular}-details-page.tsx`,
  );
  console.log(detailsPageFilePath);
  const listPageFile = fs.readFileSync(detailsPageFilePath, "utf-8");
  const updatedListPageFile = listPageFile
    .replace(new RegExp(reference.tsType, "g"), resource.tsType)
    .replace(new RegExp(reference.name, "g"), resource.name)
    .replace(new RegExp(reference.pascalCase, "g"), resource.pascalCase)
    .replace(new RegExp(reference.pathName, "g"), resource.pathName)
    .replace(new RegExp(reference.pathSingular, "g"), resource.pathSingular)
    .replace(new RegExp(reference.title, "g"), resource.title);

  fs.writeFileSync(detailsPageFilePath, updatedListPageFile);

  console.log("Files updated successfully. exporting page");
  const pagesIndexFilePath = path.join(pageComponentPath, "..", "index.ts");
  fs.appendFileSync(
    pagesIndexFilePath,
    `\nexport * from "./${resource.pathSingular}-details-page";\n`,
  );
  console.log("Page exported successfully");
}

// createListComponent();
// createListPage();
createDetailsPage();
