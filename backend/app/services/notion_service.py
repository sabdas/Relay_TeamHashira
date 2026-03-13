"""
Notion Service — append-only writes.
Never overwrites existing content in the user's Notion database.
"""
import httpx
from typing import List, Dict, Any


async def list_databases(notion_token: str) -> List[Dict[str, Any]]:
    """List Notion databases the integration has access to"""
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api.notion.com/v1/search",
            headers={
                "Authorization": f"Bearer {notion_token}",
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json",
            },
            json={
                "filter": {"value": "database", "property": "object"},
                "page_size": 20,
            },
        )
        if res.status_code != 200:
            return []

        data = res.json()
        return [
            {
                "id": db["id"],
                "title": db.get("title", [{}])[0].get("text", {}).get("content", "Untitled")
                if db.get("title")
                else "Untitled",
            }
            for db in data.get("results", [])
        ]


async def append_to_database(
    notion_token: str,
    database_id: str,
    data: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Append a new page to a Notion database.
    This is an APPEND-ONLY operation — existing pages are never modified.
    """
    async with httpx.AsyncClient() as client:
        properties = {
            "Name": {"title": [{"text": {"content": data.get("title", "Relay Update")}}]},
        }

        if data.get("status"):
            properties["Status"] = {"select": {"name": data["status"]}}

        if data.get("company"):
            properties["Company"] = {"rich_text": [{"text": {"content": data["company"]}}]}

        if data.get("notes"):
            properties["Notes"] = {"rich_text": [{"text": {"content": data["notes"][:2000]}}]}

        res = await client.post(
            "https://api.notion.com/v1/pages",
            headers={
                "Authorization": f"Bearer {notion_token}",
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json",
            },
            json={
                "parent": {"database_id": database_id},
                "properties": properties,
            },
        )

        if res.status_code not in (200, 201):
            raise Exception(f"Notion API error: {res.status_code} — {res.text}")

        return res.json()


async def append_note_to_page(
    notion_token: str,
    page_id: str,
    note: str,
) -> bool:
    """
    Append a text block to an existing page.
    Append-only — does not modify existing content.
    """
    async with httpx.AsyncClient() as client:
        res = await client.patch(
            f"https://api.notion.com/v1/blocks/{page_id}/children",
            headers={
                "Authorization": f"Bearer {notion_token}",
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json",
            },
            json={
                "children": [
                    {
                        "object": "block",
                        "type": "paragraph",
                        "paragraph": {
                            "rich_text": [{"type": "text", "text": {"content": note[:2000]}}]
                        },
                    }
                ]
            },
        )
        return res.status_code in (200, 201)
