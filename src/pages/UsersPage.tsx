// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useTable, type Column } from "@tanstack/react-table";
// import apiClient from "../services/Apiclient";

// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// interface FetchUsersResponse {
//   data: User[];
//   next_page_url: string | null;
//   prev_page_url: string | null;
// }

// const fetchUsers = async (
//   page: number,
//   perPage: number
// ): Promise<FetchUsersResponse> => {
//   const response = await apiClient.get(
//     `/users?page=${page}&perPage=${perPage}`
//   );
//   return response.data;
// };

// const UsersPage = () => {
//   const [page, setPage] = useState<number>(1);
//   const [perPage] = useState<number>(10);

//   const { data, isLoading, isError } = useQuery<FetchUsersResponse>({
//     queryKey: ["users", page, perPage],
//     queryFn: () => fetchUsers(page, perPage),
//   });

//   const columns: Column<User>[] = [
//     {
//       header: "ID",
//       accessorKey: "id",
//     },
//     {
//       header: "Name",
//       accessorKey: "name",
//     },
//     {
//       header: "Email",
//       accessorKey: "email",
//     },
//   ];

//   const tableInstance = useTable({
//     columns,
//     data: data?.data || [],
//   });

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     tableInstance;

//   const handleNextPage = () => {
//     if (data?.next_page_url) {
//       setPage((prevPage) => prevPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (data?.prev_page_url) {
//       setPage((prevPage) => prevPage - 1);
//     }
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error loading users.</div>;

//   return (
//     <div>
//       <h1>Users</h1>
//       <table {...getTableProps()}>
//         <thead>
//           {headerGroups.map((headerGroup) => (
//             <tr {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map((column) => (
//                 <th {...column.getHeaderProps()}>{column.render("Header")}</th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody {...getTableBodyProps()}>
//           {rows.map((row) => {
//             prepareRow(row);
//             return (
//               <tr {...row.getRowProps()}>
//                 {row.cells.map((cell) => (
//                   <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
//                 ))}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//       <div>
//         <button onClick={handlePreviousPage} disabled={!data?.prev_page_url}>
//           Previous
//         </button>
//         <button onClick={handleNextPage} disabled={!data?.next_page_url}>
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UsersPage;
