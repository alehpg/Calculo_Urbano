import db from "../db.mjs"; // Corrigindo a importação do módulo db



export const createForca = (req, res) => {
  const {
    poste_id, vao, angulo, rede_mt, valor_rede_mt, rede_bt, valor_rede_bt,
    nivel_cruzeta_mt, estaio, valor_estaio, uso_mutuo, valor_uso_mutuo
  } = req.body;

  const sql = `
    INSERT INTO forcas (poste_id, vao, angulo, rede_mt, valor_rede_mt, rede_bt, valor_rede_bt, 
                        nivel_cruzeta_mt, estaio, valor_estaio, uso_mutuo, valor_uso_mutuo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    poste_id, vao, angulo, rede_mt, valor_rede_mt, rede_bt, valor_rede_bt, 
    nivel_cruzeta_mt, estaio, valor_estaio, uso_mutuo, valor_uso_mutuo
  ], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Erro ao salvar a força.", error: err });
    }
    res.status(201).json({ success: true, message: "Força salva com sucesso." });
  });
};


// Função interna usada na rota combinada para salvar forças associadas a postes
export const createForcaInternal = ({
  posteId, vao, angulo, rede_mt, valor_rede_mt, rede_bt, valor_rede_bt,
  nivel_cruzeta_mt, estaio, valor_estaio, uso_mutuo, valor_uso_mutuo
}) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO forcas (poste_id, vao, angulo, rede_mt, valor_rede_mt, rede_bt, valor_rede_bt, 
                          nivel_cruzeta_mt, estaio, valor_estaio, uso_mutuo, valor_uso_mutuo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      posteId, vao, angulo, rede_mt, valor_rede_mt, rede_bt, valor_rede_bt, 
      nivel_cruzeta_mt, estaio, valor_estaio, uso_mutuo, valor_uso_mutuo
    ], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};
