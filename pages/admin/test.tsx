import * as React from 'react';

type InputSet = {
    detail: string;
    date: string;
    amount: number | '';
};

const Index: React.FC = () => {

    const [inputList, setInputList] = React.useState<InputSet[]>([]);

    const handleAddInput = () => {
        setInputList([...inputList, { detail: '', date: '', amount: '' }]);
    };

    const handleChange = (index: number, field: keyof InputSet, value: string) => {
        const newList = [...inputList];
        newList[index] = { ...newList[index], [field]: value };
        setInputList(newList);
    };

    React.useEffect(() => {
        setInputList([...inputList, { detail: '', date: '', amount: '' }]);
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log(inputList);
    };

    return (
        <form onSubmit={handleSubmit}>
            <pre>
                {JSON.stringify(inputList)}
            </pre>
            {inputList.map((input, index) => (
                <div key={index}>
                    <input
                        type="text"
                        value={input.detail}
                        onChange={(e) => handleChange(index, 'detail', e.target.value)}
                    />
                    <input
                        type="date"
                        value={input.date}
                        onChange={(e) => handleChange(index, 'date', e.target.value)}
                    />
                    <input
                        type="number"
                        value={input.amount}
                        onChange={(e) => handleChange(index, 'amount', e.target.value)}
                    />
                </div>
            ))}
            <button type="button" onClick={handleAddInput}>Add Input</button>
            <button type="submit">Submit</button>
        </form>
    );
};

export default Index;
