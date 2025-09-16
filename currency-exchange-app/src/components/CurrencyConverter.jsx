import React, { useState, useEffect } from "react";
import "./CurrencyConverter.css";

function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("TRY");
  const [to, setTo] = useState("USD");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("conversionHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  async function handleConvert() {
    if (!amount) return;

    try {
      const API_KEY = "0a766b23ac9253bbcd14576b";
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`
      );
      const data = await res.json();
      const rate = data.conversion_rates[to];

      if (rate) {
        const converted = (amount * rate).toFixed(3);
        setResult(converted);

        const newEntry = {
          amount,
          from,
          to,
          result: converted,
          date: new Date().toLocaleString(),
        };

        const updatedHistory = [newEntry, ...history].slice(0, 5);
        setHistory(updatedHistory);
        localStorage.setItem("conversionHistory", JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error("API hatası:", error);
    }
  }

  function handleSwap() {
    setFrom(to);
    setTo(from);
    setResult("");
  }

  return (
    <div>
      <h2>Currency Converter</h2>

      <div className="input-row">
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
        <option>USD</option>
        <option>EUR</option>
        <option>GBP</option>
        <option>TRY</option>
      </select>

      <input
        type="text"
        className="exchangefrom"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />

      <label className="switch">
        <input type="checkbox" onChange={handleSwap} />
        <span className="slider"></span>
      </label>

      <select value={to} onChange={(e) => setTo(e.target.value)}>
        <option>USD</option>
        <option>EUR</option>
        <option>GBP</option>
        <option>TRY</option>
      </select>

      <input
        type="text"
        className="exchangeto"
        value={result}
        readOnly
        placeholder="Result"
      />

      <button className="changebutton" onClick={handleConvert}>
        Exchange
      </button>

      </div>
      <table>
        <thead>
          <tr>
            <th colSpan="5">Last Conversions</th>
          </tr>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>From</th>
            <th>To</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, i) => (
            <tr key={i}>
              <td>{entry.date}</td>
              <td>{entry.amount}</td>
              <td>{entry.from}</td>
              <td>{entry.to}</td>
              <td>{entry.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CurrencyConverter;
