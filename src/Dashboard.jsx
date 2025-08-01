import supabase from "./supabase-client";
import { useEffect, useState } from 'react';

function Dashboard() {
  const [metrics, setMetrics] =  useState([]);

  useEffect(() => {
    fetchMatrics();
  }, []);

  async function fetchMatrics() {
    try {
      const {error, data} = await supabase
      .from('sales_deals')
      .select(
        `
        name,
        value.sum()
        `,
      )
      if (error) {
        throw error;
      }
      console.log(metrics, "data of metrics 1");
      setMetrics(data);
      
    } catch (error) {
      console.error('Error fetching metrics:', error, metrics);
    }

  }
  
  return (
    <div className="dashboard-wrapper">
      <div className="chart-container">
        <h2>Total Sales This Quarter ($)</h2>
      </div>
    </div>
  );
}

export default Dashboard;