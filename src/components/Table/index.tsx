import React from 'react'
import { TableContainer, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    display: 'table',
    backgroundColor: '#ffffff',
    borderRadius: '40px',
    '& .MuiTableCell-root': {
      fontSize: '16px',
      borderBottom: 'none',
      padding: '14px 20px',
      '& svg': {
        marginRight: 8
      },
      '&:first-child': {
        paddingLeft: 50
      },
      '&:last-child': {
        paddingRight: 50
      }
    },
    '& table': {
      width: '100%',
      borderCollapse: 'collapse'
    }
  },
  tableHeader: {
    '& .MuiTableCell-root': {
      padding: '22px 20px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#000000',
      borderBottom: '1px solid #000000',
      '&:first-child': {
        paddingLeft: 50
      },
      '&:last-child': {
        paddingRight: 50
      }
    }
  },
  tableRow: {
    borderBottom: '1px solid #999999',
    height: 72,
    '&:hover': {
      backgroundColor: ' rgba(178, 243, 85, 0.08)'
    },
    '&:last-child': {
      border: 'none'
    }
  }
})

export default function Table({ header, rows }: { header: string[]; rows: (string | number | JSX.Element)[][] }) {
  const classes = useStyles()
  return (
    <TableContainer className={classes.root}>
      <table>
        <TableHead className={classes.tableHeader}>
          <TableRow>
            {header.map((string, idx) => (
              <TableCell key={idx}>{string}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={row[0].toString() + idx} className={classes.tableRow}>
              {row.map((data, idx) => (
                <TableCell key={idx}>{data}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </table>
    </TableContainer>
  )
}
