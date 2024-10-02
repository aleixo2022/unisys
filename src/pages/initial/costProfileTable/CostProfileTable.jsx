import React, { useState, useEffect } from 'react';
import axios from '../../../services/axiosConfig';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../../../features/session/sessionSlice';
import { useTable, usePagination } from 'react-table';
import styles from './CostProfileTable.module.css';
import { FaEdit, FaTrash, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { Header } from '../../../components/Header/Header';

export function CostProfileTable() {
  const [data, setData] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [newRow, setNewRow] = useState({ state: '', state_code: '', percentage: '' });
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/settings/cost_profiles');
      setData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const handleEdit = (row) => {
    setEditingRowId(row.id);
  };

  const goToHome = () => {
    navigate('/initial/configuration');
  };

  const handleSave = async (row) => {
    try {
      await axios.put(`/api/settings/cost_profile/${row.id}`, {
        state: row.state,
        state_code: row.state_code,
        percentage: parseFloat(row.percentage),
        own:parseFloat(row.own),
      });
      setEditingRowId(null);
      fetchData();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/settings/cost_profile/${id}`);
      fetchData();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const handleAdd = async () => {
    // Validação simples dos campos
    if (!newRow.state || !newRow.state_code || !newRow.percentage || !newRow.own) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
  
    try {
      await axios.post('/api/settings/cost_profile', {
        state: newRow.state.trim(),
        state_code: newRow.state_code.trim(),
        percentage: parseFloat(newRow.percentage),
        own: parseFloat(newRow.own),
      });
      setNewRow({ state: '', state_code: '', percentage: '' , own: ''});
      fetchData();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // O estado já está cadastrado
        alert('Este estado já está cadastrado!');
      } else {
        console.error('Erro ao adicionar novo registro:', error);
        alert('Ocorreu um erro ao adicionar o registro.');
      }
    }
  };
  const handleInputChange = (e, rowIndex, columnId) => {
    const value = e.target.value;
    setData((oldData) =>
      oldData.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const handleNewRowChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Estado',
        accessor: 'state',
        Cell: ({ row, value }) =>
          editingRowId === row.original.id ? (
            <input
              value={value}
              onChange={(e) => handleInputChange(e, row.index, 'state')}
            />
          ) : (
            value
          ),
      },
      {
        Header: 'Código do Estado',
        accessor: 'state_code',
        Cell: ({ row, value }) =>
          editingRowId === row.original.id ? (
            <input
              value={value}
              onChange={(e) => handleInputChange(e, row.index, 'state_code')}
            />
          ) : (
            value
          ),
      },
      {
        Header: 'Alíq. Interestadual',
        accessor: 'percentage',
        Cell: ({ row, value }) =>
          editingRowId === row.original.id ? (
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => handleInputChange(e, row.index, 'percentage')}
            />
          ) : (
            `${parseFloat(value).toFixed(2)}%`
          ),
      },
      {
        Header: 'Proprio',
        accessor: 'own',
        Cell: ({ row, value }) =>
          editingRowId === row.original.id ? (
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => handleInputChange(e, row.index, 'own')}
            />
          ) : (
            `${parseFloat(value).toFixed(2)}%`
          ),
      },
      {
        Header: 'Editar',
        accessor: 'edit',
        Cell: ({ row }) =>
          editingRowId === row.original.id ? (
            <>
              <button
                onClick={() => handleSave(row.original)}
                className={`${styles.actionButton} ${styles.saveButton}`}
              >
                <FaSave size={14} className={styles.icon} />
              </button>

              <button
                onClick={() => setEditingRowId(null)}
                className={`${styles.actionButton} ${styles.cancelButton}`}
              >
                <FaTimes size={14} className={styles.icon} />
              </button>
            </>
          ) : (
            <button
              onClick={() => handleEdit(row.original)}
              className={`${styles.actionButton} ${styles.editButton}`}
            >
              <FaEdit size={14} className={styles.icon} />
            </button>
          ),
      },
      {
        Header: 'Excluir',
        accessor: 'delete',
        Cell: ({ row }) =>
          editingRowId !== row.original.id && (
            <button
              onClick={() => handleDelete(row.original.id)}
              className={styles.actionButton}
            >
              <FaTrash size={14} />
            </button>
          ),
      },
    ],
    [data, editingRowId]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Usamos 'page' em vez de 'rows' para paginação
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, // Define o tamanho inicial da página
    },
    usePagination
  );

  return (
    <>
      <Header />

      <div className={styles.container}>      
        <h2>Tabela de Alíquotas</h2>
        <table {...getTableProps()} className={styles.table}>
        <button className={styles.backButton} onClick={goToHome}>
          <FaArrowLeft />
          <span>Voltar</span>
        </button>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={`header-${headerGroup.id}`}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} key={`column-${column.id}`}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
            <tr>
              <th></th>
              <th>
                <input
                  name="state"
                  value={newRow.state}
                  onChange={handleNewRowChange}
                  placeholder="Novo Estado"
                />
              </th>
              <th>
                <input
                  name="state_code"
                  value={newRow.state_code}
                  onChange={handleNewRowChange}
                  placeholder="Código"
                />
              </th>
              <th>
                <input
                  name="percentage"
                  type="number"
                  step="0.01"
                  value={newRow.percentage}
                  onChange={handleNewRowChange}
                  placeholder="Porcentagem"
                />
              </th>
              <th>
                <input
                  name="own"
                  type="number"
                  step="0.01"
                  value={newRow.own}
                  onChange={handleNewRowChange}
                  placeholder="Próprio"
                />
              </th>
              <th colSpan="2">
                <button onClick={handleAdd} className={styles.addButton}>
                  Adicionar
                </button>
              </th>
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={`row-${row.id}`}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} key={`cell-${cell.column.id}-${row.id}`}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Controles de Paginação */}
        <div className={styles.pagination}>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'Inicio'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'Voltar'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'Próxima'}
          </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'Última'}
          </button>{' '}
          {/* <span>
            Página{' '}
            <strong>
              {pageIndex + 1} de {pageOptions.length}
            </strong>{' '}
          </span> */}
            {/* <span>
                | Ir para página:{' '}
                <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                    const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                    gotoPage(pageNumber);
                }}
                style={{ width: '50px' }}
                />
            </span>{' '} */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Mostrar {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
