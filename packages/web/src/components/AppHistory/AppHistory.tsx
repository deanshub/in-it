export function AppHistory() {
  return (
    <div className="flex flex-col">
      <Chart />
      <BuildsList />
    </div>
  );
}

function Chart() {
  return <div>Chart</div>;
}

function BuildsList() {
  return (
    <div className="flex flex-col">
      <BuildItem />
    </div>
  );
}

function BuildItem() {
  return (
    <div className="flex">
      <span>1.0.0</span>
      <span>5 minutes ago</span>
      <span>3.5MB</span>
      <span>actions</span>
    </div>
  );
}
