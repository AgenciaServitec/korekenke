import React from "react";
import styled from "styled-components";
export const DecreeSheet = ({ decree }) => {
  console.log("decree: ", decree);

  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <h2 className="header__title">
            EL CRL EP JEFE DEL ESTADO MAYOR DEL COBIENE
          </h2>
          <h2 className="header__title">DEPARTAMENTO DECRETADO: DEPER</h2>
        </div>
        <div className="main">
          <WrapperContent>
            <div className="main__table">
              <table>
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Establecimiento</th>
                    <th>Tipo</th>
                    <th>Sector</th>
                    <th>Ubigeo</th>
                    <th>Edad</th>
                    <th>Sexo</th>
                    <th>Grupo</th>
                    <th>Personal</th>
                    <th>Condicion</th>
                    <th>Tiempo de permanencia</th>
                    <th>Tiempo de puesto</th>
                    <th>Item 1</th>
                    <th>Item 2</th>
                    <th>Item 3</th>
                    <th>Item 4</th>
                    <th>Item 5</th>
                    <th>Item 6</th>
                    <th>Item 7</th>
                    <th>Item 8</th>
                    <th>Item 9</th>
                    <th>Item 10</th>
                    <th>Item 11</th>
                    <th>Item 12</th>
                    <th>Item 13</th>
                    <th>Item 14</th>
                    <th>Item 15</th>
                    <th>Item 16</th>
                    <th>Item 17</th>
                    <th>Item 18</th>
                    <th>Item 19</th>
                    <th>Item 20</th>
                    <th>Item 21</th>
                    <th>Item 22</th>
                    <th>Item 23</th>
                    <th>Item 24</th>
                    <th>Item 25</th>
                    <th>Item 26</th>
                    <th>Item 27</th>
                    <th>Item 28</th>
                    <th>Item 29</th>
                    <th>Item 30</th>
                    <th>Item 31</th>
                    <th>Item 32</th>
                    <th>Item 33</th>
                    <th>Item 34</th>
                    <th>Escala L</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </WrapperContent>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11px;

  .sheet {
    .header {
      &__title {
        text-transform: uppercase;
        text-align: center;
        font-size: 1.4em;
      }
    }

    .main {
      &__information {
        width: 85%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        text-transform: uppercase;
        font-size: 0.9em;

        > div {
          display: flex;
          flex-direction: column;
          gap: 1em;
          div {
            display: flex;
            gap: 0.5em;
            text-transform: uppercase;
            span:last-child {
              font-weight: 700;
            }
          }
        }
      }

      &__table {
        table {
          width: 100%;
          tr {
            width: 100%;
          }
        }
        th,
        td {
          border: 1px solid #000;
        }

        th {
          text-transform: uppercase;
          padding: 0.5em 0.2em;
          font-size: 0.5em;
        }

        td {
          height: 3em;
          padding: 0.5em;
          font-size: 0.6em;
          &:nth-child(2) {
            width: 50px;
          }

          &:nth-child(9) {
            width: 50px;
          }
        }
      }
    }
  }
`;

const WrapperContent = styled.div`
  padding: 0.8em 0;
`;
