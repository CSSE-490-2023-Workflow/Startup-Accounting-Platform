import React, { useCallback, useState, useEffect } from 'react';
import NumberInput from './NumberInput';

interface CashFlowItem {
    description: string;
    amount: number;
}

function CashFlow() {
    const [operatingCashFlow, setOperatingCashFlow] = useState([{ description: '', amount: 0 }]);
    const [investingCashFlow, setInvestingCashFlow] = useState([{ description: '', amount: 0 }]);
    const [financingCashFlow, setFinancingCashFlow] = useState([{ description: '', amount: 0 }]);

    const addRow = (table: CashFlowItem[], setTable: React.Dispatch<React.SetStateAction<CashFlowItem[]>>) => {
        setTable([...table, { description: '', amount: 0 }]);
    };

    const updateRow = (table: CashFlowItem[], setTable: React.Dispatch<React.SetStateAction<CashFlowItem[]>>, index: number, key: 'description' | 'amount', value: string | number) => {
        const updatedTable = [...table];
        if (key === 'amount') {
            updatedTable[index][key] = typeof value === 'string' ? parseFloat(value) : value;
        } else {
            updatedTable[index][key] = String(value);
        }
        setTable(updatedTable);
    };

    const calculateNetIncrease = () => {
        const operatingTotal = operatingCashFlow.reduce((total, item) => total + item.amount, 0);
        const investingTotal = investingCashFlow.reduce((total, item) => total + item.amount, 0);
        const financingTotal = financingCashFlow.reduce((total, item) => total + item.amount, 0);

        return operatingTotal + investingTotal + financingTotal;
    };

    const [netIncreaseInCash, setNetIncreaseInCash] = useState<number>(0);

    useEffect(() => {
        const operatingTotal = operatingCashFlow.reduce((total, item) => total + item.amount, 0);
        const investingTotal = investingCashFlow.reduce((total, item) => total + item.amount, 0);
        const financingTotal = financingCashFlow.reduce((total, item) => total + item.amount, 0);
        const totalNetIncrease = operatingTotal + investingTotal + financingTotal;
        setNetIncreaseInCash(totalNetIncrease);
    }, [operatingCashFlow, investingCashFlow, financingCashFlow]);

    return (
        <div className="App">

            <div className="cash-flow-container">

                <div className="cash-flow-table">

                    {/* Operating Cash Flow Table */}
                    <h2>Operating Cash Flow</h2>
                    <button onClick={() => addRow(operatingCashFlow, setOperatingCashFlow)}>Add Row</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {operatingCashFlow.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateRow(operatingCashFlow, setOperatingCashFlow, index, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.amount}
                                            onChange={(e) => updateRow(operatingCashFlow, setOperatingCashFlow, index, 'amount', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

                <div className="cash-flow-table">

                    {/* Investing Cash Flow Table */}
                    <h2>Investing Cash Flow</h2>
                    <button onClick={() => addRow(investingCashFlow, setInvestingCashFlow)}>Add Row</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {investingCashFlow.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateRow(investingCashFlow, setInvestingCashFlow, index, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.amount}
                                            onChange={(e) => updateRow(investingCashFlow, setInvestingCashFlow, index, 'amount', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

                <div className="cash-flow-table">

                    {/* Financing Cash Flow Table */}
                    <h2>Financing Cash Flow</h2>
                    <button onClick={() => addRow(financingCashFlow, setFinancingCashFlow)}>Add Row</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {financingCashFlow.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateRow(financingCashFlow, setFinancingCashFlow, index, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.amount}
                                            onChange={(e) => updateRow(financingCashFlow, setFinancingCashFlow, index, 'amount', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>

            {/* Net Increase in Cash */}
            <h2>Net Increase in Cash</h2>
            <p>{calculateNetIncrease()}</p>
        </div>
    );
}

export default CashFlow;
