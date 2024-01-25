import JSONExplorer from "./components/JSONExplorer";

const demoData = JSON.parse(`{
  "date": "2021-10-27T07:49:14.896Z",
  "hasError": false,
  "fields": [
    {
      "id": "4c212130",
      "prop": "iban",
      "value": "DE81200505501265402568",
      "hasError": false
    }
  ]
}`);

export default function App() {
  return <JSONExplorer json={demoData} />;
}
