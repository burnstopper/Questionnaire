import httpx

from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.crud.answers import answers
from app.schemas.answers import Answers

from app.database.dependencies import get_db

from app.core.config import settings

answers_router = APIRouter()


@answers_router.post("/submit", status_code=201)
async def submit_answer(answers_in: Answers,
                        respondent_token: Optional[str] = None,
                        db: Session = Depends(get_db)):
    """
    Submit answers from respondent.
    """

    # sets retries amount to 10 and if after this User microservice does not respond - raise normal exception (5xx)
    transport = httpx.AsyncHTTPTransport(retries=10)
    timeout = httpx.Timeout(1.0)
    async with httpx.AsyncClient(transport=transport, timeout=timeout) as client:
        if respondent_token is None:
            respondent_token = (await client.post(f'http://{settings.HOST}:{settings.TOKEN_SERVICE_PORT}'
                                                  f'/api/user/new_respondent',
                                                  headers={'Authorization': f'Bearer {settings.BEARER_TOKEN}'})
                                ).text
            # here must be also request to frontend for setting token in cookies

        respondent_id = int(
            (await client.get(f'http://{settings.HOST}:{settings.TOKEN_SERVICE_PORT}'
                              f'/api/user/{respondent_token}',
                              headers={'Authorization': f'Bearer {settings.BEARER_TOKEN}'})
             ).text
        )

    existing_answers = await answers.get_by_respondent_id(db=db, respondent_id=respondent_id)
    if existing_answers is not None:
        await answers.update(db=db, db_answers=existing_answers, answers_in=answers_in)
    else:
        await answers.create(db=db, answers_in=answers_in, respondent_id=respondent_id)
