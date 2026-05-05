export default function ChartPage() {
  return (
    <>
      <div>
        <canvas id="myChart"></canvas>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

      <script
        dangerouslySetInnerHTML={{
          __html: `const ctx = document.getElementById('myChart');


const labels = ['Content', 'Structure', 'Keyword', 'Accessibility', 'Performance'];
const data = {
  labels,
  datasets: [
    {
      label: 'D0',
      data: [100, 200, 250, 200, 304],
      borderColor: 'rgba(150,100,250, 1)',
      backgroundColor: 'rgba(150,100,230, .05)',
    },
    {
      label: 'D1',
      data: [200, 350, 200, 200, 212],
      borderColor: 'rgba(23,80,222, 1)',
      backgroundColor: 'rgba(23,180,222, .05)',
    },
    {
      label: 'D2',
      data: [220, 200, 204, 334, 258],
      borderColor: 'rgba(230,20,152, 1)',
      backgroundColor: 'rgba(230,20,152, .05)',
    }
  ]
};

  new Chart(ctx, {
    type: 'radar',
    data,
    options: {
responsive: true,
  }
  });`,
        }}
      />
    </>
  );
}
