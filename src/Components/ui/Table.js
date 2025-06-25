import TableRow from "./TableRow";

export default function Table({ data, setData }) {
  return (
    <div className="relative overflow-auto grid  grid-cols-table whitespace-normal bg-white rounded-2xl  p-4  ">
      <table className="min-w-full bg-[#F7FAFC] border  border-gray-200">
        <thead>
          <tr className="border-b font-inter font-medium border-gray-200">
            <th className="px-6 py-4 text-left text-sm  ">Drug Name</th>
            <th className="px-6 py-4 text-left text-sm ">Dosage Form</th>
            <th className="px-6 py-4 text-left text-sm ">Usage</th>
            <th className="px-6 py-4 text-left text-sm ">Company</th>
            <th className="px-6 py-4 text-left text-sm ">Is Founded</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <TableRow
              setIsFounded={(IsFounded) => {
                setData((prevData) => {
                  const newData = [...prevData];
                  newData[index].IsFounded = IsFounded;
                  return newData;
                });
              }}
              key={index}
              {...item}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
