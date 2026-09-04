import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="page notfound" id="conteudo">
      <div className="shell notfound__shell">
        <p className="meta">Erro 404</p>
        <h1 className="notfound__title t-h1">
          Essa máquina
          <br />
          não está no pátio.
        </h1>
        <p className="notfound__body">
          Esta página não faz parte da coleção POLLY. Volte para explorar
          os veículos e encontrar uma nova direção.
        </p>
        <Link to="/colecao" className="btn btn--paper btn--lg">
          Ver a coleção
        </Link>
      </div>
    </main>
  );
}
