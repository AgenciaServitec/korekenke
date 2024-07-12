import React from "react";
import styled from "styled-components";
import { Surveys } from "../../../../data-list";

export const OrganizationalClimateStudiesSheet = ({
  organizationClimateStudies,
}) => {
  const escalaL = (items) => {
    let include = [];
    let exclude = [];

    Object.entries(items)
      .map(([key, value]) => {
        if (
          key === "item2" ||
          key === "item9" ||
          key === "item15" ||
          key === "item22" ||
          key === "item28" ||
          key === "item32"
        ) {
          return value;
        }
      })
      .filter((item) => {
        if (item === 2 || item === 3) include.push(item);
        if (item === 1 || item === 4) exclude.push(item);
      });

    if (include.length >= 1 && include.length <= 3) return "Incluir";
    if (exclude.length >= 4 && exclude.length <= 6) return "Excluir";
  };

  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <h2 className="header__title">ESTUDIO DEL CLIMA ORGANIZACIONAL</h2>
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
                    <th>Profesion</th>
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
                <tbody>
                  {organizationClimateStudies.map(
                    (organizationClimateStudy, index) => (
                      <tr key={index}>
                        <td>{organizationClimateStudy.number}</td>
                        <td>
                          {organizationClimateStudy.questions.establishment}
                        </td>
                        <td>{organizationClimateStudy.questions.type}</td>
                        <td>{organizationClimateStudy.questions.subsector}</td>
                        <td>{organizationClimateStudy.questions.ubigeus}</td>
                        <td>{organizationClimateStudy.questions.age}</td>
                        <td>{organizationClimateStudy.questions.gender}</td>
                        <td>
                          {organizationClimateStudy.questions.occupationalGroup}
                        </td>
                        <td>
                          {Surveys.questions[7].options.find(
                            (_profession) =>
                              _profession.value ===
                              organizationClimateStudy?.questions?.profession
                          )?.label || ""}
                        </td>
                        <td>{organizationClimateStudy.questions.condition}</td>
                        <td>{organizationClimateStudy.questions.dwellTime}</td>
                        <td>
                          {
                            organizationClimateStudy.questions
                              .timeInCurrentPosition
                          }
                        </td>
                        <td>{organizationClimateStudy.items.item1}</td>
                        <td>{organizationClimateStudy.items.item2}</td>
                        <td>{organizationClimateStudy.items.item3}</td>
                        <td>{organizationClimateStudy.items.item4}</td>
                        <td>{organizationClimateStudy.items.item5}</td>
                        <td>{organizationClimateStudy.items.item6}</td>
                        <td>{organizationClimateStudy.items.item7}</td>
                        <td>{organizationClimateStudy.items.item8}</td>
                        <td>{organizationClimateStudy.items.item9}</td>
                        <td>{organizationClimateStudy.items.item10}</td>
                        <td>{organizationClimateStudy.items.item11}</td>
                        <td>{organizationClimateStudy.items.item12}</td>
                        <td>{organizationClimateStudy.items.item13}</td>
                        <td>{organizationClimateStudy.items.item14}</td>
                        <td>{organizationClimateStudy.items.item15}</td>
                        <td>{organizationClimateStudy.items.item16}</td>
                        <td>{organizationClimateStudy.items.item17}</td>
                        <td>{organizationClimateStudy.items.item18}</td>
                        <td>{organizationClimateStudy.items.item19}</td>
                        <td>{organizationClimateStudy.items.item20}</td>
                        <td>{organizationClimateStudy.items.item21}</td>
                        <td>{organizationClimateStudy.items.item22}</td>
                        <td>{organizationClimateStudy.items.item23}</td>
                        <td>{organizationClimateStudy.items.item24}</td>
                        <td>{organizationClimateStudy.items.item25}</td>
                        <td>{organizationClimateStudy.items.item26}</td>
                        <td>{organizationClimateStudy.items.item27}</td>
                        <td>{organizationClimateStudy.items.item28}</td>
                        <td>{organizationClimateStudy.items.item29}</td>
                        <td>{organizationClimateStudy.items.item30}</td>
                        <td>{organizationClimateStudy.items.item31}</td>
                        <td>{organizationClimateStudy.items.item32}</td>
                        <td>{organizationClimateStudy.items.item33}</td>
                        <td>{organizationClimateStudy.items.item34}</td>
                        <td>{escalaL(organizationClimateStudy.items)}</td>
                      </tr>
                    )
                  )}
                </tbody>
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
