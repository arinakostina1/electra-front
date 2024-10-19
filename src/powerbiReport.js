function PowerBIReport() {
    return (
      <div style={{ width: '100%', height: '100vh' }}>
        <iframe
          title="Power BI Report"
          src="https://app.powerbi.com/reportEmbed?reportId=6e9ec247-d891-4db6-af70-d87aac4e4731&autoAuth=true&ctid=8dd1e6b4-8dac-408e-8d8d-6753e9800530"
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen={true}
        />
      </div>
    );
  }
  
  export default PowerBIReport;
  